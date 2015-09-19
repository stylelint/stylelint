import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "comment-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before comment",
  rejected: "Unexpected empty line before comment",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkComments(comment => {

      // Ignore the first node
      if (comment === root.first) { return }

      const before = comment.raw("before")

      // Ignore inline comments
      if (before.indexOf("\n") === -1) { return }

      const expectEmptyLineBefore = (expectation === "always") ? true : false

      const emptyLineBefore = before.indexOf("\n\n") !== -1
        || before.indexOf("\r\n\r\n") !== -1

      // Return if the exceptation is met
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
