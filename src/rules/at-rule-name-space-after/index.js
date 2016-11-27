const isStandardSyntaxAtRule = require("../../utils/isStandardSyntaxAtRule")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")

export const ruleName = "at-rule-name-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: name => `Expected single space after at-rule name \"${name}\"`,
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "always-single-line" ],
    })
    if (!validOptions) {
      return
    }

    atRuleNameSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function atRuleNameSpaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkAtRules(atRule => {
    if (!isStandardSyntaxAtRule(atRule)) {
      return
    }

    checkColon(`@${atRule.name}${atRule.raws.afterName}${atRule.params}`, atRule.name.length, atRule)
  })

  function checkColon(source, index, node) {
    locationChecker({
      source,
      index,
      err: m => report({
        message: m,
        node,
        index,
        result,
        ruleName: checkedRuleName,
      }),
      errTarget: `@${node.name}`,
    })
  }
}
