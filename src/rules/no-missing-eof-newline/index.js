import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-missing-eof-newline"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing newline at end of file",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const sourceCss = root.toString()
    if (sourceCss === "") { return }
    if (sourceCss.slice(-1) !== "\n") {
      report({
        message: messages.rejected,
        node: root,
        index: root.toString().length - 1,
        result,
        ruleName,
      })
    }
  }
}
