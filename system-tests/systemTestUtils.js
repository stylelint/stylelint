import _ from "lodash"
import path from "path"
import stripAnsi from "strip-ansi"

export function caseFilePath(caseNumber, fileName) {
  return path.join(__dirname, caseNumber, fileName)
}

export function caseStylesheetGlob(caseNumber) {
  return caseFilePath(caseNumber, "stylesheet.*")
}

export function caseConfig(caseNumber, ext = "json") {
  return caseFilePath(caseNumber, `config.${ext}`)
}

export function prepResults(results) {
  return results.map((result) => {
    // The _postcssResult object is not part of our API and is huge
    const preppedResult = _.omit(result, "_postcssResult")

    // The `source` of each file will not be the same on different machines
    preppedResult.source = path.relative(__dirname, result.source)

    return preppedResult
  })
}

export function stripColors(input) {
  return stripAnsi(input)
}
