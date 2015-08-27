import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "comment-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: `Expected single space after "/*"`,
  rejectedOpening: `Unexpected whitespace after "/*"`,
  expectedClosing: `Expected single space before "*/"`,
  rejectedClosing: `Unexpected whitespace before "*/"`,
})

export default function (expectation) {
  return function (root, result) {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkComments(function (comment) {

      const { left, right } = comment.raws

      if (left !== "" && expectation === "never") {
        report({
          message: messages.rejectedOpening,
          node: comment,
          result,
          ruleName,
        })
      }
      if (left !== " " && expectation === "always") {
        report({
          message: messages.expectedOpening,
          node: comment,
          result,
          ruleName,
        })
      }

      if (right !== "" && expectation === "never") {
        report({
          message: messages.rejectedClosing,
          node: comment,
          result,
          ruleName,
        })
      }
      if (right !== " " && expectation === "always") {
        report({
          message: messages.expectedClosing,
          node: comment,
          result,
          ruleName,
        })
      }
    })
  }
}
