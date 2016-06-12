import { isNumber, repeat } from "lodash"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "max-empty-lines"

export const messages = ruleMessages(ruleName, {
  expected: max => `Expected no more than ${max} empty line(s)`,
})

export default function (max) {
  const maxAdjacentNewlines = max + 1

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: isNumber,
    })
    if (!validOptions) { return }

    const rootString = root.toString()
    const repeatLFNewLines = repeat("\n", maxAdjacentNewlines)
    const repeatCRLFNewLines = repeat("\r\n", maxAdjacentNewlines)

    styleSearch({ source: rootString, target: "\n" }, match => {
      checkMatch(rootString, match.endIndex, root)
    })

    // We must check comments separately in order to accommodate stupid
    // `//`-comments from SCSS, which postcss-scss converts to `/* ... */`,
    // which adds to extra characters at the end, which messes up our
    // warning position
    root.walkComments(comment => {
      const source = comment.raw("left") + comment.text + comment.raw("right")
      styleSearch({ source, target: "\n" }, match => {
        checkMatch(source, match.endIndex, comment, 2)
      })
    })

    function checkMatch(source, matchEndIndex, node, offset = 0) {
      let violationIndex = false
      if (source.substr(matchEndIndex, maxAdjacentNewlines) === repeatLFNewLines) {
        violationIndex = matchEndIndex + maxAdjacentNewlines
      } else if (source.substr(matchEndIndex, maxAdjacentNewlines * 2) === repeatCRLFNewLines) {
        violationIndex = matchEndIndex + (maxAdjacentNewlines * 2)
      }

      if (!violationIndex) { return }

      report({
        message: messages.expected(max),
        node,
        index: violationIndex + offset,
        result,
        ruleName,
      })
    }
  }
}
