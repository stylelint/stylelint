import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "stylelint-disable-reason"

export const messages = ruleMessages(ruleName, {
  expectedPreceding: "Expected comment reason preceding stylelint disable comment",
  expectedSucceeding: "Expected comment reason succeeding stylelint disable comment",
})

const stylelintDisableCommand= "stylelint-disable"

export default function (expectation) {
  return function (root, result) {
    result.stylelint = result.stylelint || {}
    result.stylelint.disabledRanges = false

    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always-preceding",
        "always-succeeding",
      ],
    })
    if (!validOptions) { return }

    root.walkComments(function (comment) {
      if (comment.text.indexOf(stylelintDisableCommand) === 0) {

        if (expectation === "always-preceding") {
          const prev = comment.prev()

          if (!prev || prev.type !== "comment" || prev.text.indexOf(stylelintDisableCommand) === 0) {
            report({
              message: messages.expectedPreceding,
              node: comment,
              result,
              ruleName,
            })
          }
        } else if (expectation === "always-succeeding") {
          const next = comment.next()

          if (!next || next.type !== "comment" || next.text.indexOf(stylelintDisableCommand) === 0) {
            report({
              message: messages.expectedSucceeding,
              node: comment,
              result,
              ruleName,
            })
          }
        }
      }
    })
  }
}
