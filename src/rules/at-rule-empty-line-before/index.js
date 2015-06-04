import {
  ruleMessages
} from "../../utils"

export const ruleName = "at-rule-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before at-rule",
  rejected: "Unexpected empty line before at-rule",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachAtRule(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      const emptyLineBefore = atRule.before.indexOf("\n\n") !== -1

      if (expectation === "always" && !emptyLineBefore) {
        result.warn(messages.expected, { node: atRule })
      }
      if (expectation === "never" && emptyLineBefore) {
        result.warn(messages.rejected, { node: atRule })
      }
    })
  }
}
