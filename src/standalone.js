import * as formatters from "./formatters"
import _ from "lodash"
import buildConfig from "./buildConfig"
import globby from "globby"
import lessSyntax from "postcss-less"
import path from "path"
import postcss from "postcss"
import { readFile } from "fs"
import scssSyntax from "postcss-scss"
import stylelintPostcssPlugin from "./postcssPlugin"
import sugarss from "sugarss"

const ignoredGlobs = [
  "!**/node_modules/**",
  "!**/bower_components/**",
]

export default function ({
  // Options
  files,
  code,
  codeFilename,
  config,
  configFile,
  configBasedir,
  configOverrides,
  ignorePath,
  syntax,
  formatter = "json",
} = {}) {
  const isValidCode = typeof code === "string"
  if (!files && !isValidCode || files && (code || isValidCode)) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  return buildConfig({
    config,
    configFile,
    configBasedir,
    configOverrides,
    ignorePath,
  }).then(({ config, configDir }) => {

    // Prepare processors
    const codeProcessors = []
    const resultProcessors = []
    if (config.processors) {
      config.processors.forEach(processorPath => {
        let processor = require(processorPath)
        processor = processor.default || processor
        const initializedProcessor = processor()
        if (initializedProcessor.code) { codeProcessors.push(initializedProcessor.code) }
        if (initializedProcessor.result) { resultProcessors.push(initializedProcessor.result) }
      })
    }

    let chosenFormatter = formatter

    if (typeof chosenFormatter === "string") {
      if (_.includes(Object.keys(formatters), chosenFormatter)) {
        chosenFormatter = formatters[chosenFormatter]
      } else {
        throw new Error("You must use a valid formatter option, either: json, string or verbose")
      }
    }

    let errored = false

    let initialisedPostcss

    if (!files) {
      return lintString(code, codeFilename).then(result => {
        const results = [result]
        const output = chosenFormatter(results)
        return {
          output,
          results,
          errored,
        }
      })
    }

    return globby([].concat(files, ignoredGlobs)).then(input => {
      if (!input.length) {
        const err = new Error("Files glob patterns specified did not match any files")
        err.code = 80
        throw err
      }
      const promises = input.map(filepath => lintFile(filepath))
      return Promise.all(promises).then(results => {
        const output = chosenFormatter(results)
        return {
          output,
          results,
          errored,
        }
      })
    })

    function lintFile(filepath) {
      return new Promise((resolve, reject) => {
        readFile(filepath, "utf8", (err, code) => {
          if (err) { return reject(err) }
          resolve(code)
        })
      }).then(code => lintString(code, filepath))
    }

    function getPostcss() {
      if (!initialisedPostcss) {
        initialisedPostcss = postcss()
          .use(stylelintPostcssPlugin({
            config,
            configFile,
            configBasedir,
            configOverrides,
            ignorePath,
            _configPromise: Promise.resolve({ config, configDir }),
          }))
      }

      return initialisedPostcss
    }

    function lintString(code, filepath) {
      const postcssProcessOptions = {}
      if (filepath) {
        postcssProcessOptions.from = filepath
      }

      const fileExtension = path.extname(filepath || "")
      if (syntax === "scss" || !syntax && fileExtension === ".scss") {
        postcssProcessOptions.syntax = scssSyntax
      } else if (syntax === "less" || !syntax && fileExtension === ".less") {
        postcssProcessOptions.syntax = lessSyntax
      } else if (syntax === "sugarss" || !syntax && fileExtension === ".sss") {
        postcssProcessOptions.syntax = sugarss
      } else if (syntax) {
        throw new Error("You must use a valid syntax option, either: scss, less or sugarss")
      }

      codeProcessors.forEach(codeProcessor => {
        code = codeProcessor(code, filepath)
      })

      return getPostcss()
        .process(code, postcssProcessOptions)
        .then(handleResult)
        .catch(cssSyntaxError)

      function handleResult(postcssResult) {
        const source = (!postcssResult.root.source)
          ? undefined
          : postcssResult.root.source.input.file || postcssResult.root.source.input.id

        if (postcssResult.stylelint.stylelintError) { errored = true }

        // Strip out deprecation warnings from the messages
        const deprecations = _.remove(postcssResult.messages, { stylelintType: "deprecation" }).map(d => {
          return {
            text: d.text,
            reference: d.stylelintReference,
          }
        })

        // Also strip out invalid options
        const invalidOptionWarnings = _.remove(postcssResult.messages, { stylelintType: "invalidOption" }).map(w => {
          return { text: w.text }
        })

        // This defines the stylelint result object that formatters receive
        let stylelintResult = {
          source,
          deprecations,
          invalidOptionWarnings,
          errored: postcssResult.stylelint.stylelintError,
          warnings: postcssResult.messages.map(message => {
            return {
              line: message.line,
              column: message.column,
              rule: message.rule,
              severity: message.severity,
              text: message.text,
            }
          }),
          ignored: postcssResult.stylelint.ignored,
          _postcssResult: postcssResult,
        }

        resultProcessors.forEach(resultProcessor => {
          // Result processors might just mutate the result object,
          // or might return a new one
          const returned = resultProcessor(stylelintResult, filepath)
          if (returned) { stylelintResult = returned }
        })

        return stylelintResult
      }

      function cssSyntaxError(error) {
        if (error.name !== "CssSyntaxError") { throw error }

        errored = true
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
    }
  })
}
