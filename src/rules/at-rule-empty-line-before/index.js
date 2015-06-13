import {
  report,
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

      if (expectation === "always" && emptyLineBefore) { return }

      if (expectation === "never" && !emptyLineBefore) { return }

      const message = (expectation === "always") ? messages.expected : messages.rejected

      report({
        message: message,
        node: atRule,
        result,
        ruleName,
      })
    })
  }
}
