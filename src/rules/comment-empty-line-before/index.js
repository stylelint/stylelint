import {
  optionsHaveException,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "comment-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before comment",
  rejected: "Unexpected empty line before comment",
})

const stylelintCommandPrefix = "stylelint-"

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    }, {
      actual: options,
      possible: {
        except: ["first-nested"],
        ignore: [
          "stylelint-commands",
          "between-comments",
        ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkComments(comment => {

      // Ignore the first node
      if (comment === root.first) { return }

      // Optionally ignore stylelint commands
      if (
        comment.text.indexOf(stylelintCommandPrefix) === 0
        && optionsHaveIgnored(options, "stylelint-commands")
      ) { return }

      // Optionally ignore newlines between comments
      const prev = comment.prev()
      if (
        prev && prev.type === "comment"
        && optionsHaveIgnored(options, "between-comments")
      ) { return }

      if (comment.raws.inline || comment.inline) { return }

      const before = comment.raw("before")

      // Ignore inline comments
      if (before.indexOf("\n") === -1) { return }

      const expectEmptyLineBefore = (() => {
        if (
          optionsHaveException(options, "first-nested")
          && comment.parent !== root
          && comment === comment.parent.first
        ) { return false }
        return expectation === "always"
      })()

      const hasEmptyLineBefore = before.indexOf("\n\n") !== -1
        || before.indexOf("\r\n\r\n") !== -1
        || before.indexOf("\n\r\n") !== -1

      // Return if the exceptation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message,
        node: comment,
        result,
        ruleName,
      })
    })
  }
}
