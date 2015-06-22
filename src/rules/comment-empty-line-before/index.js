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
 * @param {"always"|"never"|" expectation
 * @param {object} options
 * @param {array} except = [inline]
 */
export default function (expectation, options) {
  return (root, result) => {
    root.eachComment(comment => {

      // Ignore the first node
      if (comment === root.first) { return }

      const expectEmptyLineBefore = (expectation === "always") ? true : false

      const emptyLineBefore = comment.before.indexOf("\n\n") !== -1

      // return if inline comment and ignoring them
      if (options && options.ignore && options.ignore.indexOf("inline") !== -1
        && comment.before.indexOf("\n") === -1) { return }

      // return if our expectation is met
      if (expectEmptyLineBefore === emptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message: message,
        node: comment,
        result,
        ruleName,
      })
    })
  }
}
