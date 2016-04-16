import chalk from "chalk"
import path from "path"
import _ from "lodash"
import symbols from "log-symbols"
import table, { getBorderCharacters } from "table"
import utils from "postcss-reporter/lib/util"

const MARGIN_WIDTHS = 9

const levelColors = {
  info: "blue",
  warning: "yellow",
  error: "red",
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

function logFrom(fromValue) {
  if (fromValue.charAt(0) === "<") return fromValue
  return path.relative(process.cwd(), fromValue).split(path.sep).join("/")
}

function getMessageWidth(columnWidths) {
  if (!process.stdout.isTTY) {
    return columnWidths[3]
  }

  const availableWidth = process.stdout.columns
  const fullWidth = _.sum(_.values(columnWidths))

  // If there is no reason to wrap the text, we won't align the last column to the right
  if (availableWidth > fullWidth + MARGIN_WIDTHS) {
    return columnWidths[3]
  }

  return availableWidth - (fullWidth - columnWidths[3] + MARGIN_WIDTHS)
}

function formatter(messages, source) {
  if (!messages.length) return ""

  const orderedMessages = _.sortBy(
    messages,
    (m) => m.line ? 2 : 1, // positionless first
    (m) => m.line ,
    (m) => m.column
  )

  // Create a list of column widths, needed to calculate
  // the size of the message column and if needed wrap it.
  const columnWidths = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 }

  const calculateWidths = function (columns) {

    _.forOwn(columns, (value, key) => {
      columnWidths[key] = Math.max(columnWidths[key], chalk.stripColor(value).toString().length)
    })

    return columns
  }

  let output = "\n"

  if (source) {
    output += chalk.bold.underline(logFrom(source)) + "\n"
  }

  const cleanedMessages = orderedMessages.map(
    (message) => {
      const location = utils.getLocation(message)
      const severity = message.severity

      const row = [
        location.line || "",
        location.column || "",
        symbols[severity] ? chalk[levelColors[severity]](symbols[severity])  : severity,
        message.text.replace(/\.$/, "").replace(new RegExp(_.escapeRegExp("(" + message.rule + ")") + "$"), ""),
        chalk.yellow(message.rule || ""),
      ]

      calculateWidths(row)

      return row
    })

  output += table(
    cleanedMessages,
    {
      border: getBorderCharacters("void"),
      columns: {
        0: { alignment: "right", width: columnWidths[0], paddingRight: 0 },
        1: { alignment: "left", width: columnWidths[1] },
        2: { alignment: "left", width: columnWidths[2] },
        3: { alignment: "left", width: getMessageWidth(columnWidths), wrapWord: true },
        4: { alignment: "left", width: columnWidths[4], paddingRight: 0 },
      },
      drawHorizontalLine: () => false,
    }
    )
    .split("\n")
    .map((el) => el.replace(/(\d+)\s+(\d+)/, (m, p1, p2) => chalk.bold(p1 + ":" + p2)))
    .join("\n")

  return output
}

export default function (results) {
  let output = invalidOptionsFormatter(results)
  output += deprecationsFormatter(results)

  return results.reduce((output, result) => {
    output += formatter(result.warnings, result.source)
    return output
  }, output)
}
