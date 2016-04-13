import chalk from "chalk"
import path from "path"
import _ from "lodash"
import symbols from "log-symbols"
import table, { getBorderCharacters } from "table"
import utils from "postcss-reporter/lib/util"

const marginWidths = 9

const levelColors = {
  "info": "blue",
  "warning": "yellow",
  "error": "red",
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

function getSeverity(type) {
  if (type == "error") {
    return "error"
  }

  if (type == "info") {
    return "info"
  }

  return "warning"
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
  if (availableWidth > fullWidth + marginWidths) {
    return columnWidths[3]
  }

  return availableWidth - (fullWidth - columnWidths[3] + marginWidths)
}

function formatter(opts) {
  const options = opts || {}
  const sortByPosition = (typeof options.sortByPosition !== "undefined") ? options.sortByPosition : true
  const positionless = options.positionless || "first"

  return function (input) {
    const messages = input.messages
    const source = input.source

    if (!messages.length) return ""

    const orderedMessages = _.sortBy(
      messages,
      (m) => {
        if (!m.line) return 1
        if (positionless === "any") return 1
        if (positionless === "first") return 2
        if (positionless === "last") return 0
      },
      (m) => sortByPosition? m.line : 1,
      (m) => sortByPosition? m.column : 1
    )

    // Create a list of column widths, needed to calculate
    // the size of the message column and if needed wrap it.
    const columnWidths = { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1 }

    const calculateWidths = function (columns) {
      let width, i
      for (i in columns) {
        if (columns.hasOwnProperty(i)) {
          width = chalk.stripColor(columns[i]).toString().length
          if (width > columnWidths[i]) {
            columnWidths[i] = width
          }
        }
      }

      return columns
    }

    let output = "\n"

    if (source) {
      output += chalk.bold.underline(logFrom(source)) + "\n"
    }

    const cleanedMessages = orderedMessages.map(
      (message) => {
        const location = utils.getLocation(message)
        const severity = getSeverity(message.severity)
        const messageType = chalk[levelColors[severity]](options.noIcon ? severity : symbols[severity])

        const escapedRule = ("(" + message.rule + ")").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")

        return calculateWidths([
          location.line || "",
          location.column || "",
          messageType,
          message.text.replace(/\.$/, "").replace(new RegExp(escapedRule + "$"), ""),
          chalk.yellow(message.rule || ""),
        ])
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
}

const minimalFormatter = formatter({
  noIcon: false,
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
