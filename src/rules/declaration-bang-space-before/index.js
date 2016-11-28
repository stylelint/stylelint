const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
import { declarationBangSpaceChecker } from "../declaration-bang-space-after"

const ruleName = "declaration-bang-space-before"

const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"!\"",
  rejectedBefore: () => "Unexpected whitespace before \"!\"",
})

const rule = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    declarationBangSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
