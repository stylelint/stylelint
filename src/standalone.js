import postcss from "postcss"
import globby from "globby"
import _ from "lodash"
import { readFile } from "fs"
import scssSyntax from "postcss-scss"
import lessSyntax from "postcss-less"
import sugarss from "sugarss"
import stylelintPostcssPlugin from "./postcssPlugin"
import * as formatters from "./formatters"

const ignoredGlobs = [
  "!**/node_modules/**",
  "!**/bower_components/**",
]

export default function ({
  files,
  code,
  codeFilename,
  config,
  configFile,
  configBasedir,
  configOverrides,
  syntax,
  formatter = "json",
} = {}) {
  const isValidCode = typeof code === "string"
  if (!files && !isValidCode || files && (code || isValidCode)) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  const chosenFormatter = (typeof formatter === "string")
    ? formatters[formatter]
    : formatter

  let errored = false

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

  function lintString(code, filepath) {
    const postcssProcessOptions = {}
    if (filepath) {
      postcssProcessOptions.from = filepath
    }

    switch (syntax) {
      case "scss":
        postcssProcessOptions.syntax = scssSyntax
        break
      case "less":
        postcssProcessOptions.syntax = lessSyntax
        break
      case "sugarss":
        postcssProcessOptions.syntax = sugarss
        break
    }

    return postcss()
      .use(stylelintPostcssPlugin({
        config,
        configFile,
        configBasedir,
        configOverrides,
      }))
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

      return {
        source,
        deprecations,
        invalidOptionWarnings,
        errored: postcssResult.stylelint.stylelintError,
        warnings: postcssResult.messages.map(message => ({
          line: message.line,
          column: message.column,
          rule: message.rule,
          severity: message.severity,
          text: message.text,
        })),
      }
    }

    function cssSyntaxError(error) {
      if (error.name !== "CssSyntaxError") { throw error }

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
}
