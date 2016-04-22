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
      const charBefore = cssString[match.startIndex - 1]
      let index = match.startIndex
      if (charBefore === "\\") { return }
      if (charBefore === "\r") index -= 1
      report({
        message: messages.rejected,
        node: root,
        index,
        result,
        ruleName,
      })
    })
  }
}
