import { isNumber } from "lodash"
import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions,
} from "../../utils"

export const ruleName = "max-line-length"

export const messages = ruleMessages(ruleName, {
  expected: l => `Expected line length equal to or less than ${l} characters`,
})

export default function (length) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      length: isNumber,
    })
    if (!validOptions) { return }

    // Collapse all urls into something nice and short
    const rootString = root.source.input.css.replace(/url\(.*\)/g, "url()")

    // Check first line
    checkNewline({ endIndex: 0 })

    // Check subsequent lines
    styleSearch({ source: rootString, target: ["\n"], checkComments: true }, checkNewline)

    function checkNewline(match) {
      let nextNewlineIndex = rootString.indexOf("\n", match.endIndex)

      // Accommodate last line
      if (nextNewlineIndex === -1) nextNewlineIndex = rootString.length

      if (nextNewlineIndex - match.endIndex <= length) { return }

      // If there are no spaces besides initial (indent) spaces, ignore
      const lineString = rootString.slice(match.endIndex, nextNewlineIndex)
      if (lineString.replace(/^\s+/, "").indexOf(" ") === -1) {
        return
      }

      report({
        message: messages.expected(length),
        node: root,
        index: nextNewlineIndex - 1,
        result,
        ruleName,
      })
    }
  }
}
