import postcss from "postcss"
import globby from "globby"
import { remove } from "lodash"
import { readFile } from "fs"
import scssSyntax from "postcss-scss"
import stylelintPostcssPlugin from "./postcssPlugin"
import * as formatters from "./formatters"

const ignoredGlobs = [
  "!**/node_modules/**",
  "!**/bower_components/**",
]

export default function ({
  files,
  code,
  config,
  configFile,
  configBasedir,
  configOverrides,
  syntax,
  formatter = "json",
} = {}) {
  if (!files && !code || files && code) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  const chosenFormatter = (typeof formatter === "string")
    ? formatters[formatter]
    : formatter

  let errored = false

  if (!files) {
    return lintString(code).then(result => {
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
    if (syntax === "scss") {
      postcssProcessOptions.syntax = scssSyntax
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

    function handleResult(postcssResult) {
      const source = (!postcssResult.root.source)
        ? undefined
        : postcssResult.root.source.input.file || postcssResult.root.source.input.id

      if (postcssResult.stylelint.stylelintError) { errored = true }

      // Strip out deprecation warnings from the messages
      const deprecations = remove(postcssResult.messages, { stylelintType: "deprecation" }).map(d => {
        return {
          text: d.text,
          reference: d.stylelintReference,
        }
      })

      return {
        source,
        deprecations,
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
  }
}
