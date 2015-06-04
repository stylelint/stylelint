import {
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
        result.warn(messages.expected, { node: comment })
      }
      if (rejectEmptyLine && emptyLineBefore) {
        result.warn(messages.rejected, { node: comment })
      }
    })
  }
}
