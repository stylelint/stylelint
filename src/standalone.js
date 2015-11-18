import postcss from "postcss"
import globby from "globby"
import { readFile } from "fs"
import scssSyntax from "postcss-scss"
import stylelintPostcssPlugin from "./postcssPlugin"
import * as formatters from "./formatters"

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
    return lint(code).then(result => {
      const results = [result]
      const output = chosenFormatter(results)
      return {
        output,
        results,
        errored,
      }
    })
  }

  return globby(files).then(input => {
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
    }).then(code => lint(code, filepath))
  }

  function lint(code, filepath) {
    const processOptions = {}
    if (filepath) {
      processOptions.from = filepath
    }
    if (syntax === "scss") {
      processOptions.syntax = scssSyntax
    }

    return postcss()
      .use(stylelintPostcssPlugin({
        config,
        configFile,
        configBasedir,
        configOverrides,
      }))
      .process(code, processOptions)
      .then(handleResult)

    function handleResult(postcssResult) {
      const source = (!postcssResult.root.source)
        ? undefined
        : postcssResult.root.source.input.file || postcssResult.root.source.input.id

      if (postcssResult.stylelint.stylelintError) { errored = true }

      return {
        source,
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
