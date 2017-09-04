/* @flow */
"use strict";
const createStylelint = require("./createStylelint");
const debug = require("debug")("stylelint:standalone");
const FileCache = require("./utils/FileCache");
const formatters /*: Object*/ = require("./formatters");
const fs = require("fs");
const globby /*: Function*/ = require("globby");
const hash = require("./utils/hash");
const ignore = require("ignore");
const needlessDisables /*: Function*/ = require("./needlessDisables");
const path = require("path");
const pify = require("pify");
const pkg = require("../package.json");

const DEFAULT_IGNORE_FILENAME = ".stylelintignore";
const FILE_NOT_FOUND_ERROR_CODE = "ENOENT";
const ALWAYS_IGNORED_GLOBS = ["**/node_modules/**", "**/bower_components/**"];

/*::type CssSyntaxErrorT = {
  column: number;
  file?: string;
  input: {
    column: number;
    file?: string;
    line: number;
    source: string;
  };
  line: number;
  message: string;
  name: string;
  reason: string;
  source: string;
}*/

module.exports = function(
  options /*: stylelint$standaloneOptions */
) /*: Promise<stylelint$standaloneReturnValue>*/ {
  const cacheLocation = options.cacheLocation;
  const code = options.code;
  const codeFilename = options.codeFilename;
  const config = options.config;
  const configBasedir = options.configBasedir;
  const configFile = options.configFile;
  const configOverrides = options.configOverrides;
  const customSyntax = options.customSyntax;
  const files = options.files;
  const fix = options.fix;
  const formatter = options.formatter;
  const ignoreDisables = options.ignoreDisables;
  const reportNeedlessDisables = options.reportNeedlessDisables;
  const syntax = options.syntax;
  const useCache = options.cache || false;
  let fileCache;
  const startTime = Date.now();

  // The ignorer will be used to filter file paths after the glob is checked,
  // before any files are actually read
  const ignoreFilePath = options.ignorePath || DEFAULT_IGNORE_FILENAME;
  const absoluteIgnoreFilePath = path.isAbsolute(ignoreFilePath)
    ? ignoreFilePath
    : path.resolve(process.cwd(), ignoreFilePath);
  let ignoreText = "";
  try {
    ignoreText = fs.readFileSync(absoluteIgnoreFilePath, "utf8");
  } catch (readError) {
    if (readError.code !== FILE_NOT_FOUND_ERROR_CODE) throw readError;
  }
  const ignorePattern = options.ignorePattern || [];
  const ignorer = ignore()
    .add(ignoreText)
    .add(ignorePattern);

  const isValidCode = typeof code === "string";
  if ((!files && !isValidCode) || (files && (code || isValidCode))) {
    throw new Error(
      "You must pass stylelint a `files` glob or a `code` string, though not both"
    );
  }

  let formatterFunction;
  if (typeof formatter === "string") {
    formatterFunction = formatters[formatter];
    if (formatterFunction === undefined) {
      return Promise.reject(
        new Error(
          "You must use a valid formatter option: 'json', 'string', 'verbose', or a function"
        )
      );
    }
  } else if (typeof formatter === "function") {
    formatterFunction = formatter;
  } else {
    formatterFunction = formatters.json;
  }

  const stylelint = createStylelint({
    config,
    configFile,
    configBasedir,
    configOverrides,
    ignoreDisables,
    reportNeedlessDisables,
    syntax,
    customSyntax,
    fix
  });

  if (!files) {
    const absoluteCodeFilename =
      codeFilename !== undefined && !path.isAbsolute(codeFilename)
        ? path.join(process.cwd(), codeFilename)
        : codeFilename;
    return stylelint
      ._lintSource({
        code,
        codeFilename: absoluteCodeFilename
      })
      .then(postcssResult => {
        // Check for file existence
        return new Promise((resolve, reject) => {
          if (!absoluteCodeFilename) {
            reject();
            return;
          }

          fs.stat(absoluteCodeFilename, err => {
            if (err) {
              reject();
            } else {
              resolve();
            }
          });
        })
          .then(() => {
            return stylelint._createStylelintResult(
              postcssResult,
              absoluteCodeFilename
            );
          })
          .catch(() => {
            return stylelint._createStylelintResult(postcssResult);
          });
      })
      .catch(handleError)
      .then(stylelintResult => {
        return prepareReturnValue([stylelintResult]);
      });
  }

  let fileList = files;
  if (typeof fileList === "string") {
    fileList = [fileList];
  }
  if (!options.disableDefaultIgnores) {
    fileList = fileList.concat(ALWAYS_IGNORED_GLOBS.map(glob => "!" + glob));
  }

  if (useCache) {
    const stylelintVersion = pkg.version;
    const hashOfConfig = hash(`${stylelintVersion}_${JSON.stringify(config)}`);
    fileCache = new FileCache(cacheLocation, hashOfConfig);
  } else {
    // No need to calculate hash here, we just want to delete cache file.
    fileCache = new FileCache(cacheLocation);
    // Remove cache file if cache option is disabled
    fileCache.destroy();
  }

  return globby(fileList)
    .then(filePaths => {
      // The ignorer filter needs to check paths relative to cwd
      filePaths = ignorer.filter(
        filePaths.map(p => path.relative(process.cwd(), p))
      );

      if (!filePaths.length) {
        return Promise.all([]);
      }

      let absoluteFilePaths = filePaths.map(filePath => {
        const absoluteFilepath = !path.isAbsolute(filePath)
          ? path.join(process.cwd(), filePath)
          : path.normalize(filePath);
        return absoluteFilepath;
      });

      if (useCache) {
        absoluteFilePaths = absoluteFilePaths.filter(
          fileCache.hasFileChanged.bind(fileCache)
        );
      }

      const getStylelintResults = absoluteFilePaths.map(absoluteFilepath => {
        debug(`Processing ${absoluteFilepath}`);
        return stylelint
          ._lintSource({
            filePath: absoluteFilepath
          })
          .then(postcssResult => {
            if (postcssResult.stylelint.stylelintError && useCache) {
              debug(
                `${absoluteFilepath} contains linting errors and will not be cached.`
              );
              fileCache.removeEntry(absoluteFilepath);
            }

            // If we're fixing, save the file with changed code
            let fixFile = Promise.resolve();
            if (!postcssResult.stylelint.ignored && options.fix) {
              const fixedCss = postcssResult.root.toString(
                postcssResult.opts.syntax
              );
              fixFile = pify(fs.writeFile)(absoluteFilepath, fixedCss);
            }

            return fixFile.then(() =>
              stylelint._createStylelintResult(postcssResult, absoluteFilepath)
            );
          })
          .catch(handleError);
      });

      return Promise.all(getStylelintResults);
    })
    .then(stylelintResults => {
      if (useCache) {
        fileCache.reconcile();
      }
      return prepareReturnValue(stylelintResults);
    });

  function prepareReturnValue(
    stylelintResults /*: Array<stylelint$result>*/
  ) /*: stylelint$standaloneReturnValue*/ {
    const errored = stylelintResults.some(
      result => result.errored || result.parseErrors.length > 0
    );
    const returnValue /*: stylelint$standaloneReturnValue*/ = {
      errored,
      output: formatterFunction(stylelintResults),
      results: stylelintResults
    };
    if (reportNeedlessDisables) {
      returnValue.needlessDisables = needlessDisables(stylelintResults);
    }
    debug(`Linting complete in ${Date.now() - startTime}ms`);
    return returnValue;
  }
};

function handleError(error /*: Object*/) {
  if (error.name === "CssSyntaxError") {
    return convertCssSyntaxErrorToResult(error);
  } else {
    throw error;
  }
}

// By converting syntax errors to stylelint results,
// we can control their appearance in the formatted output
// and other tools like editor plugins can decide how to
// present them, as well
function convertCssSyntaxErrorToResult(
  error /*: CssSyntaxErrorT*/
) /*: stylelint$result*/ {
  if (error.name !== "CssSyntaxError") {
    throw error;
  }

  return {
    source: error.file || "<input css 1>",
    deprecations: [],
    invalidOptionWarnings: [],
    parseErrors: [],
    errored: true,
    warnings: [
      {
        line: error.line,
        column: error.column,
        rule: error.name,
        severity: "error",
        text: error.reason + " (" + error.name + ")"
      }
    ]
  };
}
