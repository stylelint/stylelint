import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "no-multiple-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty line",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const rootString = root.source.input.css
    styleSearch({ source: rootString, target: "\n", checkComments: true }, match => {
      if (
        rootString.substr(match.startIndex + 1, 2) === "\n\n"
        || rootString.substr(match.startIndex + 1, 4) === "\r\n\r\n"
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
