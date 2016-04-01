import { isNumber, repeat } from "lodash"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "max-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty line",
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

    styleSearch({ source: rootString, target: "\n", checkComments: true }, match => {
      if (
        rootString.substr(match.startIndex + 1, maxAdjacentNewlines) === repeatLFNewLines
        || rootString.substr(match.startIndex + 1, maxAdjacentNewlines * 2) === repeatCRLFNewLines
      ) {
        report({
          message: messages.rejected,
          node: root,
          index: match.startIndex,
          result,
          ruleName,
        })
      }
    })
  }
}
