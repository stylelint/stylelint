import postcss from "postcss"
import globby from "globby"
import fs from "fs"
import queue from "queue-async"
import scssSyntax from "postcss-scss"
import stylelintPostcssPlugin from "./postcssPlugin"
import formatters from "./formatters"

export default function ({
  files,
  code,
  config,
  configBasedir,
  configOverrides,
  syntax,
  formatter = "json",
} = {}) {
  if ((!files && !code) || (files && code)) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  return new Promise((resolve, reject) => {
    const chosenFormatter = (typeof formatter === "string")
      ? formatters[formatter]
      : formatter

    const postcssResults = []
    const results = []
    let errored = false

    const inputReady = (files) ? globby(files) : Promise.resolve(code)
    inputReady.then(input => {
      const q = queue()

      if (typeof input === "string") {
        q.defer(lint, input, null)
      } else {
        if (!input.length) {
          const err = new Error("Files glob patterns specified did not match any files")
          err.code = 80
          reject(err)
        }
        input.forEach(filepath => {
          q.defer(lintFile, filepath)
        })
      }

      q.awaitAll(err => {
        if (err) {
          reject(err)
        }
        const output = chosenFormatter(results)
        resolve({ output, results, postcssResults, errored })
      })
    })

    function lintFile(filepath, cb) {
      fs.readFile(filepath, "utf8", (err, code) => {
        if (err) { reject(err) }
        lint(code, filepath, cb)
      })
    }

    function lint(code, filepath, cb) {
      const processOptions = {}
      if (filepath) {
        processOptions.from = filepath
      }
      if (syntax === "scss") {
        processOptions.syntax = scssSyntax
      }
      postcss()
        .use(stylelintPostcssPlugin({ config, configBasedir, configOverrides }))
        .process(code, processOptions)
        .then(postcssResult => {
          const source = (!postcssResult.root.source)
            ? undefined
            : postcssResult.root.source.input.file || postcssResult.root.source.input.id

          if (postcssResult.stylelint.stylelintError) { errored = true }
          results.push({
            source,
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
          })
          cb()
        })
        .catch(cb)
    }
  })
}
