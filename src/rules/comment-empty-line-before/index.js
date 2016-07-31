import {
  hasEmptyLine,
  optionsHasKeyword,
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
        && optionsHasKeyword(options, "ignore", "stylelint-commands")
      ) { return }

      // Optionally ignore newlines between comments
      const prev = comment.prev()
      if (
        prev && prev.type === "comment"
        && optionsHasKeyword(options, "ignore", "between-comments")
      ) { return }

      if (comment.raws.inline || comment.inline) { return }

      const before = comment.raw("before")

      // Ignore shared-line comments
      if (before.indexOf("\n") === -1) { return }

      const expectEmptyLineBefore = (() => {
        if (
          optionsHasKeyword(options, "except", "first-nested")
          && comment.parent !== root
          && comment === comment.parent.first
        ) { return false }
        return expectation === "always"
      })()

      const hasEmptyLineBefore = hasEmptyLine(before)

      // Return if the expectation is met
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
