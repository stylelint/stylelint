import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "comment-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty comment",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkComments(comment => {
      // To ignore inline SCSS comments
      if (comment.raws.inline || comment.inline) { return }
      // To ignore comments that are not empty
      if (comment.text && comment.text.length !== 0) { return }
      report({
        message: messages.rejected,
        node: comment,
        result,
        ruleName,
      })
    })
  }
}
