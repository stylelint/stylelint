const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
import { atRuleNameSpaceChecker } from "../at-rule-name-space-after"

export const ruleName = "at-rule-name-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: name => `Expected newline after at-rule name \"${name}\"`,
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "always-multi-line" ],
    })
    if (!validOptions) {
      return
    }

    atRuleNameSpaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName,
    })
  }
}
