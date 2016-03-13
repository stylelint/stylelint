import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "string-no-newline"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected newline in string",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const cssString = root.toString()
    styleSearch({ source: cssString, target: "\n", withinStrings: true }, match => {
      if (cssString[match.startIndex - 1] === "\\") { return }
      report({
        message: messages.rejected,
        node: root,
        index: match.startIndex,
        result,
        ruleName,
      })
    })
  }
}
