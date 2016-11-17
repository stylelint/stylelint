/* @flow */
import * as formatters from "./formatters"
import createStylelint from "./createStylelint"
import globby from "globby"
import needlessDisables from "./needlessDisables"

const alwaysIgnoredGlobs = [
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
  ignoreDisables,
  ignorePath,
  reportNeedlessDisables,
  formatter,
  syntax,
  customSyntax,
}: stylelint$standaloneOptions = {}): Promise<stylelint$standaloneReturnValue> {
  const isValidCode = typeof code === "string"
  if (!files && !isValidCode || files && (code || isValidCode)) {
    throw new Error("You must pass stylelint a `files` glob or a `code` string, though not both")
  }

  let formatterFunction: Function
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
    return stylelint._lintSource({ code, codeFilename })
      .then((postcssResult) => {
        return stylelint._createStylelintResult(postcssResult)
      })
      .catch(handleError)
      .then((stylelintResult) => {
        return prepareReturnValue([stylelintResult])
      })
  }

  return globby([].concat(files, alwaysIgnoredGlobs))
    .then((filePaths) => {
      if (!filePaths.length) {
        const err: Object = new Error("Files glob patterns specified did not match any files")
        err.code = 80
        throw err
      }

      const getStylelintResults = filePaths.map((filePath) => {
        return stylelint._lintSource({ filePath })
          .then((postcssResult) => {
            return stylelint._createStylelintResult(postcssResult, filePath)
          })
          .catch(handleError)
      })

      return Promise.all(getStylelintResults)
    })
    .then(prepareReturnValue)

  function prepareReturnValue(
    stylelintResults: Array<stylelint$result>,
  ): stylelint$standaloneReturnValue {
    const errored = stylelintResults.some((result) => result.errored)
    const returnValue: stylelint$standaloneReturnValue = {
      errored,
      output: formatterFunction(stylelintResults),
      results: stylelintResults,
    }
    if (reportNeedlessDisables) {
      returnValue.needlessDisables = needlessDisables(stylelintResults)
    }
    return returnValue
  }
}

function handleError(error) {
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
function convertCssSyntaxErrorToResult(
  error: Object,
): stylelint$result {
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
