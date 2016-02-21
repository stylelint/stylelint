import chalk from "chalk"
import _ from "lodash"
import formatter from "postcss-reporter/lib/formatter"

const minimalFormatter = formatter({
  noIcon: true,
  noPlugin: true,
})

export default function (results) {
  let output = invalidOptionsFormatter(results)
  output += deprecationsFormatter(results)

  return results.reduce((output, result) => {
    output += minimalFormatter({
      messages: result.warnings,
      source: result.source,
    })
    return output
  }, output)
}

function deprecationsFormatter(results) {
  const allDeprecationWarnings = _.flatMap(results, "deprecations")
  const uniqueDeprecationWarnings = _.uniqBy(allDeprecationWarnings, "text")

  if (!uniqueDeprecationWarnings || !uniqueDeprecationWarnings.length) { return "" }

  return uniqueDeprecationWarnings.reduce((output, warning) => {
    output += chalk.yellow.bold(">> Deprecation Warning: ")
    output += warning.text
    if (warning.reference) {
      output += chalk.yellow(" See: ")
      output += chalk.green.underline(warning.reference)
    }
    return output + "\n"
  }, "\n")
}

function invalidOptionsFormatter(results) {
  const allInvalidOptionWarnings = _.flatMap(results, r => r.invalidOptionWarnings.map(w => w.text))
  const uniqueInvalidOptionWarnings = _.uniq(allInvalidOptionWarnings)

  return uniqueInvalidOptionWarnings.reduce((output, warning) => {
    output += chalk.red.bold(">> Invalid Option: ")
    output += warning
    return output + "\n"
  }, "\n")
}
