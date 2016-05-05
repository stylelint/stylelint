import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "stylelint-disable-reason"

export const messages = ruleMessages(ruleName, {
  expectedBefore: "Expected comment reason before `stylelint-disable` comment",
  expectedAfter: "Expected comment reason after `stylelint-disable` comment",
})

const stylelintDisableCommand = "stylelint-disable"
const stylelintDisableLineCommand = "stylelint-disable-line"

export default function (expectation) {
  return function (root, result) {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always-before",
        "always-after",
      ],
    })
    if (!validOptions) { return }

    root.walkComments(function (comment) {
      if (comment.text.indexOf(stylelintDisableCommand) !== 0) { return }

      if (expectation === "always-before") {
        const prev = comment.prev()
        const prevIsCommentAndValid = prev
          && prev.type === "comment"
          && !isDisableCommand(prev.text)

        let prevDisableLineIsCommentAndValid = false

        if (comment.text.indexOf(stylelintDisableLineCommand) === 0
          && !prevIsCommentAndValid
          && prev
        ) {
          const friendlyPrev = prev.prev()

          prevDisableLineIsCommentAndValid = friendlyPrev
            && friendlyPrev.type === "comment"
            && !isDisableCommand(friendlyPrev.text)
        }

        if (!prevIsCommentAndValid && !prevDisableLineIsCommentAndValid) {
          const disableRanges = result.stylelint.disabledRanges
          result.stylelint.disabledRanges = false

          report({
            message: messages.expectedBefore,
            node: comment,
            result,
            ruleName,
          })
          result.stylelint.disabledRanges = disableRanges
        }
      } else if (expectation === "always-after") {
        const next = comment.next()
        const nextIsCommentAndValid = next
          && next.type === "comment"
          && !isDisableCommand(next.text)

        if (!nextIsCommentAndValid) {
          const disableRanges = result.stylelint.disabledRanges
          result.stylelint.disabledRanges = false

          report({
            message: messages.expectedAfter,
            node: comment,
            result,
            ruleName,
          })
          result.stylelint.disabledRanges = disableRanges
        }
      }
    })

    function isDisableCommand(text) {
      return text.indexOf(stylelintDisableCommand) === 0
    }
  }
}
