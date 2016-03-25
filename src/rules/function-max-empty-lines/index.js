import { isNumber, repeat } from "lodash"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "function-max-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty line within function",
})

export default function (max) {
  const maxAdjacentNewlines = max + 1

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: isNumber,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (decl.value.indexOf("(") === -1) { return }

      const declString = decl.toString()
      const repeatLFNewLines = repeat("\n", maxAdjacentNewlines)
      const repeatCRLFNewLines = repeat("\r\n", maxAdjacentNewlines)

      styleSearch({ source: declString, target: "\n", withinFunctionalNotation: true }, match => {
        if (
          declString.substr(match.startIndex + 1, maxAdjacentNewlines) === repeatLFNewLines
          || declString.substr(match.startIndex + 1, maxAdjacentNewlines * 2) === repeatCRLFNewLines
        ) {
          report({
            message: messages.rejected,
            node: decl,
            index: match.startIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
