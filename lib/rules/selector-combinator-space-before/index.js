"use strict"

const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const selectorCombinatorSpaceChecker = require("../selectorCombinatorSpaceChecker")

const ruleName = "selector-combinator-space-before"

const messages = ruleMessages(ruleName, {
  expectedBefore: combinator => `Expected single space before "${combinator}"`,
  rejectedBefore: combinator => `Unexpected whitespace before "${combinator}"`,
})

const rule = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) {
      return
    }

    selectorCombinatorSpaceChecker({
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
