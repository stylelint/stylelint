import {
  optionsMatches,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isNumber } from "lodash"
import styleSearch from "style-search"

export const ruleName = "max-line-length"

export const messages = ruleMessages(ruleName, {
  expected: l => `Expected line length to be no more than ${l} characters`,
})

export default function (maxLength, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: maxLength,
      possible: isNumber,
    }, {
      actual: options,
      possible: {
        ignore: [ "non-comments", "comments" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    // Collapse all urls into something nice and short,
    // so they do not throw the game
    const rootString = root.toString().replace(/url\(.*\)/ig, "url()")

    const ignoreNonComments = optionsMatches(options, "ignore", "non-comments")
    const ignoreComments = optionsMatches(options, "ignore", "comments")

    // Check first line
    checkNewline({ endIndex: 0 })

    // Check subsequent lines
    styleSearch({ source: rootString, target: ["\n"], comments: "check" }, checkNewline)

    function complain(index) {
      report({
        index,
        result,
        ruleName,
        message: messages.expected(maxLength),
        node: root,
      })
    }

    function checkNewline(match) {
      const endOfLineIndicator = (rootString.indexOf("\r\n", match.endIndex) !== -1) ? "\r\n" : "\n"
      let nextNewlineIndex = rootString.indexOf(endOfLineIndicator, match.endIndex)

      // Accommodate last line
      if (nextNewlineIndex === -1) {
        nextNewlineIndex = rootString.length
      }

      // If the line's length is less than or equal to the specified
      // max, ignore it ... So anything below is liable to be complained about
      if (nextNewlineIndex - match.endIndex <= maxLength) { return }

      const complaintIndex = nextNewlineIndex - 1

      if (ignoreComments) {
        if (match.insideComment) { return }

        // This trimming business is to notice when the line starts a
        // comment but that comment is indented, e.g.
        //       /* something here */
        const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2)
        if (nextTwoChars === "/*" || nextTwoChars === "//") { return }
      }

      if (ignoreNonComments) {
        if (match.insideComment) {
          return complain(complaintIndex)
        }

        // This trimming business is to notice when the line starts a
        // comment but that comment is indented, e.g.
        //       /* something here */
        const nextTwoChars = rootString.slice(match.endIndex).trim().slice(0, 2)
        if (nextTwoChars !== "/*" && nextTwoChars !== "//") { return }
        return complain(complaintIndex)
      }

      // If there are no spaces besides initial (indent) spaces, ignore it
      const lineString = rootString.slice(match.endIndex, nextNewlineIndex)
      if (lineString.replace(/^\s+/, "").indexOf(" ") === -1) {
        return
      }

      return complain(complaintIndex)
    }
  }
}
