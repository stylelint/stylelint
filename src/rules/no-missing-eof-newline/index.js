import { ruleMessages } from "../../utils"

export const ruleName = "no-missing-eof-newline"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing newline at end of file",
})

export default function () {
  return function (root, result) {
    if (root.source.input.css.slice(-1) !== "\n") {
      result.warn(messages.rejected, { node: root })
    }
  }
}
