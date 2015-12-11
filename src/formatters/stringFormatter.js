import chalk from "chalk"
import formatter from "postcss-reporter/lib/formatter"

const minimalFormatter = formatter({
  noIcon: true,
  noPlugin: true,
})

export default function (results) {
  return results.reduce((output, result) => {
    output += deprecationsFormatter(result.deprecations)
    output += minimalFormatter({
      messages: result.warnings,
      source: result.source,
    })
    return output
  }, "")
}

function deprecationsFormatter(warnings) {
  if (!warnings || !warnings.length) { return "" }

  return warnings.reduce((output, warning) => {
    output += chalk.yellow.bold(">> Deprecation Warning: ")
    output += chalk.yellow(warning.text)
    if (warning.reference) {
      output += chalk.yellow(" See: ")
      output += chalk.green.underline(warning.reference)
    }
    return output + "\n"
  }, "\n")
}
