import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "comment-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before comment",
  rejected: "Unexpected empty line before comment",
})

/**
 * @param {"always"|"never"|"always-except-inline"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachComment(comment => {

      // Ignore the first node
      if (comment === root.first) { return }

      const isInlineComment = comment.before.indexOf("\n") === -1

      const expectEmptyLine = (expectation === "always"
        || expectation === "always-except-inline" && !isInlineComment)

      const rejectEmptyLine = (expectation === "never")

      const emptyLineBefore = comment.before.indexOf("\n\n") !== -1

      if (expectEmptyLine && !emptyLineBefore) {
        report({
          message: messages.expected,
          node: comment,
          result,
          ruleName,
        })
      }
      if (rejectEmptyLine && emptyLineBefore) {
        report({
          message: messages.rejected,
          node: comment,
          result,
          ruleName,
        })
      }
    })
  }
}
