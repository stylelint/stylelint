import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "rule-trailing-semicolon"

export const messages = ruleMessages(ruleName, {
  expected: `Expected a trailing semicolon`,
  rejected: `Unexpected trailing semicolon`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return (css, result) => {

    css.eachRule(function (rule) {

      // return early if an empty rule
      if (rule.nodes.length === 0) { return }

      // check semi colon
      if (expectation === "always" && rule.semicolon) { return }
      if (expectation === "never" && !rule.semicolon) { return }

      let message = (expectation === "always") ? messages.expected : messages.rejected

      report({
        message: message,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
