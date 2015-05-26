import { ruleMessages } from "../../utils"

export const ruleName = "eof-newline"

export const messages = ruleMessages(ruleName, {
  expected: "Expected newline at end of file",
})

export default function () {
  return function (root, result) {
    if (root.source.input.css.slice(-1) !== "\n") {
      result.warn(messages.expected, { node: root })
    }
  }
}
