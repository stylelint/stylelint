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
    styleSearch({ source: rootString, target: "\n", checkComments: true }, match => {
      if (
        rootString.substr(match.startIndex + 1, maxAdjacentNewlines) === repeat("\n", maxAdjacentNewlines)
        || rootString.substr(match.startIndex + 1, maxAdjacentNewlines * 2) === repeat("\r\n", maxAdjacentNewlines)
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
