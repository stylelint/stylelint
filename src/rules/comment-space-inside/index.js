import {
  isWhitespace,
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

      if (comment.raws.inline) { return }

      const rawComment = comment.toString()
      const leftMatches = rawComment.match(/(^\/\*+)(\s)?/)
      const rightMatches = rawComment.match(/(\s)?(\*+\/)$/)
      const opener = leftMatches[1]
      const leftSpace = leftMatches[2] || ""
      const rightSpace = rightMatches[1] || ""
      const closer = rightMatches[2]

      if (expectation === "never" && leftSpace !== "") {
        report({
          message: messages.rejectedOpening,
          node: comment,
          index: opener.length,
          result,
          ruleName,
        })
      }
      if (expectation === "always" && !isWhitespace(leftSpace)) {
        report({
          message: messages.expectedOpening,
          node: comment,
          index: opener.length,
          result,
          ruleName,
        })
      }

      if (expectation === "never" && rightSpace !== "") {
        report({
          message: messages.rejectedClosing,
          node: comment,
          index: comment.toString().length - closer.length - 1,
          result,
          ruleName,
        })
      }
      if (expectation === "always" && !isWhitespace(rightSpace)) {
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
