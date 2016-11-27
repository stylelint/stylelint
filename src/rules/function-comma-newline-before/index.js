const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
import { functionCommaSpaceChecker } from "../function-comma-space-after"

export const ruleName = "function-comma-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected newline before \",\"",
  expectedBeforeMultiLine: () => "Expected newline before \",\" in a multi-line function",
  rejectedBeforeMultiLine: () => "Unexpected whitespace before \",\" in a multi-line function",
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "always-multi-line", "never-multi-line" ],
    })
    if (!validOptions) {
      return
    }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.beforeAllowingIndentation,
      checkedRuleName: ruleName,
    })
  }
}
