/* @flow */
"use strict"
const path = require("path")
const formatters/*: Object*/ = require("./formatters")
const createStylelint = require("./createStylelint")
const globby/*: Function*/ = require("globby")
const needlessDisables/*: Function*/ = require("./needlessDisables")
const alwaysIgnoredGlobs = require("./alwaysIgnoredGlobs")
const FileCache = require("./utils/FileCache")
const debug = require("debug")("stylelint:standalone")
const pkg = require("../package.json")
const hash = require("./utils/hash")

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

module.exports = function (options/*: stylelint$standaloneOptions */)/*: Promise<stylelint$standaloneReturnValue>*/ {
  const files = options.files
  const code = options.code
  const codeFilename = options.codeFilename
  const config = options.config
  const configFile = options.configFile
  const configBasedir = options.configBasedir
  const configOverrides = options.configOverrides
  const ignoreDisables = options.ignoreDisables
  const ignorePath = options.ignorePath
  const reportNeedlessDisables = options.reportNeedlessDisables
  const formatter = options.formatter
  const syntax = options.syntax
  const customSyntax = options.customSyntax
  const allowEmptyInput = options.allowEmptyInput
  const cacheLocation = options.cacheLocation
  const useCache = options.cache || false
  let fileCache

  const startTime = Date.now()

  const isValidCode = typeof code === "string"
  if (!files && !isValidCode || files && (code || isValidCode)) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  let formatterFunction
  if (typeof formatter === "string") {
    formatterFunction = formatters[formatter]
    if (formatterFunction === undefined) {
      return Promise.reject(new Error("You must use a valid formatter option: 'json', 'string', 'verbose', or a function"))
    }
  } else if (typeof formatter === "function") {
    formatterFunction = formatter
  } else {
    formatterFunction = formatters.json
  }

  const stylelint = createStylelint({
    config,
    configFile,
    configBasedir,
    configOverrides,
    ignoreDisables,
    ignorePath,
    reportNeedlessDisables,
    syntax,
    customSyntax,
  })

  if (!files) {
    const absoluteCodeFilename = (codeFilename !== undefined && !path.isAbsolute(codeFilename))
      ? path.join(process.cwd(), codeFilename)
      : codeFilename
    return stylelint._lintSource({
      code,
      codeFilename: absoluteCodeFilename,
    }).then(postcssResult => {
      return stylelint._createStylelintResult(postcssResult)
    }).catch(handleError).then(stylelintResult => {
      return prepareReturnValue([stylelintResult])
    })
  }

  let fileList = files
  if (typeof fileList === "string") {
    fileList = [fileList]
  }
  fileList = fileList.concat(
    alwaysIgnoredGlobs.map(file => "!" + file)
  )

  if (useCache) {
    const stylelintVersion = pkg.version
    const hashOfConfig = hash(`${stylelintVersion}_${JSON.stringify(config)}`)
    fileCache = new FileCache(cacheLocation, hashOfConfig)
  } else {
    // No need to calculate hash here, we just want to delete cache file.
    fileCache = new FileCache(cacheLocation)
    // Remove cache file if cache option is disabled
    fileCache.destroy()
  }

  return globby(fileList).then(filePaths => {
    if (!filePaths.length) {
      if (allowEmptyInput === undefined || !allowEmptyInput) {
        const message = (files => {
          if (typeof files === "string") {
            return `${files} does`
          }
          // seperate files into last (last file) and initial) all the others
          const initial = files.slice(0)
          const last = initial.pop()
          // join into a comma seperated string of file names
          const ending = (files.length > 1 ? `and ${last} do` : `${last} does`)
          return `${initial.join(", ")} ${ending}`.trim()
        })(files) + " not match any files"

        const err/*: Object*/ = new Error(message)
        err.code = 80
        throw err
      } else {
        return Promise.all([])
      }
    }

    let absoluteFilePaths = filePaths.map(filePath => {
      const absoluteFilepath = (!path.isAbsolute(filePath))
        ? path.join(process.cwd(), filePath)
        : path.normalize(filePath)
      return absoluteFilepath
    })

    if (useCache) {
      absoluteFilePaths = absoluteFilePaths.filter(fileCache.hasFileChanged.bind(fileCache))
    }

    const getStylelintResults = absoluteFilePaths.map(absoluteFilepath => {
      debug(`Processing ${absoluteFilepath}`)
      return stylelint._lintSource({
        filePath: absoluteFilepath,
      }).then(postcssResult => {
        if (postcssResult.stylelint.stylelintError && useCache) {
          debug(`${absoluteFilepath} contains linting errors and will not be cached.`)
          fileCache.removeEntry(absoluteFilepath)
        }
        return stylelint._createStylelintResult(postcssResult, absoluteFilepath)
      }).catch(handleError)
    })

    return Promise.all(getStylelintResults)
  }).then(prepareReturnValue)

  function prepareReturnValue(stylelintResults/*: Array<stylelint$result>*/)/*: stylelint$standaloneReturnValue*/ {
    const errored = stylelintResults.some(result => result.errored)
    const returnValue/*: stylelint$standaloneReturnValue*/ = {
      errored,
      output: formatterFunction(stylelintResults),
      results: stylelintResults,
    }
    if (reportNeedlessDisables) {
      returnValue.needlessDisables = needlessDisables(stylelintResults)
    }
    if (useCache) {
      fileCache.reconcile()
    }
    debug(`Linting complete in ${Date.now() - startTime}ms`)
    return returnValue
  }
}

function handleError(error/*: Object*/) {
  if (error.name === "CssSyntaxError") {
    return convertCssSyntaxErrorToResult(error)
  } else {
    throw error
  }
}

// By converting syntax errors to stylelint results,
// we can control their appearance in the formatted output
// and other tools like editor plugins can decide how to
// present them, as well
function convertCssSyntaxErrorToResult(error/*: CssSyntaxErrorT*/)/*: stylelint$result*/ {
  if (error.name !== "CssSyntaxError") {
    throw error
  }

  return {
    source: error.file || "<input css 1>",
    deprecations: [],
    invalidOptionWarnings: [],
    errored: true,
    warnings: [{
      line: error.line,
      column: error.column,
      rule: error.name,
      severity: "error",
      text: error.reason + " (" + error.name + ")",
    }],
  }
}
