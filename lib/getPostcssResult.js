/* @flow */
"use strict";

const autoSyntax = require("postcss-html");
const dynamicRequire = require("./dynamicRequire");
const fs = require("fs");
const less = require("postcss-less");
const path = require("path");
const postcss = require("postcss");
const safeParser = require("postcss-safe-parser");
const scss = require("postcss-scss");
const sugarss = require("sugarss");
const syntaxes /*: {
  [syntaxName: string]: postcss$syntax,
}*/ = {
  css: {
    stringify: postcss.stringify
  },
  less,
  scss,
  sss: sugarss,
  sugarss
};

const postcssProcessor = postcss();

module.exports = function(
  stylelint /*: stylelint$internalApi*/
) /*: Promise<?Object>*/ {
  const options /*: {
    code?: string,
    codeFilename?: string,
    filePath?: string,
    codeProcessors?: Array<Function>,
    syntax?: stylelint$syntaxes,
    customSyntax?: string
  }*/ =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  const cached /*: ?postcss$result*/ = stylelint._postcssResultCache.get(
    options.filePath
  );
  if (cached) return Promise.resolve(cached);

  let getCode;
  if (options.code !== undefined) {
    getCode = Promise.resolve(options.code);
  } else if (options.filePath) {
    getCode = readFile(options.filePath);
  }

  if (!getCode) {
    throw new Error("code or filePath required");
  }

  return getCode
    .then(code => {
      const customSyntax = stylelint._options.customSyntax;
      let syntax = stylelint._options.syntax;

      if (customSyntax) {
        try {
          syntax = dynamicRequire(customSyntax);
        } catch (e) {
          throw new Error(
            `Cannot resolve custom syntax module ${customSyntax}`
          );
        }
      } else if (syntax) {
        syntax = syntaxes[syntax];
        if (!syntax) {
          throw new Error(
            "You must use a valid syntax option, either: scss, less or sugarss"
          );
        }
      } else {
        syntaxes.css.parse = stylelint._options.fix
          ? safeParser
          : postcss.parse;
        const fileExtension = path
          .extname(options.filePath || "")
          .slice(1)
          .toLowerCase();
        syntax = syntaxes[fileExtension] || autoSyntax(syntaxes);
      }

      const postcssOptions /*: postcss$options*/ = {};

      postcssOptions.from = options.filePath;

      /*
     * PostCSS allows for syntaxes that only contain a parser, however,
     * it then expects the syntax to be set as the `parser` option rather than `syntax.
     */
      if (syntax && !syntax.stringify) {
        postcssOptions.parser = syntax;
      } else {
        postcssOptions.syntax = syntax;
      }

      const source = options.code ? options.codeFilename : options.filePath;
      let preProcessedCode = code;
      if (options.codeProcessors) {
        options.codeProcessors.forEach(codeProcessor => {
          preProcessedCode = codeProcessor(preProcessedCode, source);
        });
      }

      return postcssProcessor.process(preProcessedCode, postcssOptions);
    })
    .then(postcssResult => {
      stylelint._postcssResultCache.set(options.filePath, postcssResult);
      return postcssResult;
    });
};

function readFile(filePath /*: string*/) /*: Promise<string>*/ {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        return reject(err);
      }
      resolve(content);
    });
  });
}
