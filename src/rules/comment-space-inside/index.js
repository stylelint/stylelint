import {
  report,
  ruleMessages,
  validateOptions,
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

      const rawComment = comment.toString()
      const leftMatches = rawComment.match(/(^\/\*+)(\s+)?\S/)
      const rightMatches = rawComment.match(/\S(\s+)?(\*+\/)/)
      const opener = leftMatches[1]
      const leftSpace = leftMatches[2] || ""
      const rightSpace = rightMatches[1] || ""
      const closer = rightMatches[2]

      if (leftSpace !== "" && expectation === "never") {
        report({
          message: messages.rejectedOpening,
          node: comment,
          index: opener.length,
          result,
          ruleName,
        })
      }
      if (leftSpace !== " " && expectation === "always") {
        report({
          message: messages.expectedOpening,
          node: comment,
          index: opener.length,
          result,
          ruleName,
        })
      }

      if (rightSpace !== "" && expectation === "never") {
        report({
          message: messages.rejectedClosing,
          node: comment,
          index: comment.toString().length - closer.length - 1,
          result,
          ruleName,
        })
      }
      if (rightSpace !== " " && expectation === "always") {
        report({
          message: messages.expectedClosing,
          node: comment,
          index: comment.toString().length - closer.length - 1,
          result,
          ruleName,
        })
      }
    })
  }
}
