import {
  report,
  ruleMessages,
  cssStatementHasEmptyBlock
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
  return (root, result) => {

    root.eachRule(rule => {
      // Return early if an empty rule
      if (cssStatementHasEmptyBlock(rule)) { return }

      if (!rule.last || rule.last.type !== "decl") { return }

      // Check semi colon
      if (expectation === "always" && rule.semicolon) { return }
      if (expectation === "never" && !rule.semicolon) { return }

      const message = (expectation === "always") ? messages.expected : messages.rejected

      report({
        message: message,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
