import {
  lineCount,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "no-omitted-eof-newline"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected omitted newline at end of file",
})

export default function () {
  return (root, result) => {
    if (root.source.input.css.slice(-1) !== "\n") {
      report({
        message: messages.rejected,
        node: root,
        line: lineCount(root.source.input.css),
        result,
        ruleName,
      })
    }
  }
}
