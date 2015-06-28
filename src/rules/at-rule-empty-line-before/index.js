import {
  cssStatementHasBlock,
  optionsHaveException,
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
 * @param {object} options - Can contain the following:
 *   - except: ["blockless-group"]
 */
export default function (expectation, options) {
  return (root, result) => {
    root.eachAtRule(atRule => {

      // Ignore the first node
      if (atRule === root.first) { return }

      const emptyLineBefore = atRule.before.indexOf("\n\n") !== -1

      let expectEmptyLineBefore = (expectation === "always") ? true : false

      const previousNode = atRule.prev()

      // Optionally reverse the expectation if in a blockless group
      if (optionsHaveException(options, "blockless-group")
        && previousNode && previousNode.type === "atrule"
        && !cssStatementHasBlock(previousNode)
        && !cssStatementHasBlock(atRule)) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Return if the exceptation is met
      if (expectEmptyLineBefore === emptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message: message,
        node: atRule,
        result,
        ruleName,
      })
    })
  }
}
