const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const styleSearch = require("style-search")

const ruleName = "selector-list-comma-space-after"

const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \",\"",
  rejectedAfter: () => "Unexpected whitespace after \",\"",
  expectedAfterSingleLine: () => "Expected single space after \",\" in a single-line list",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \",\" in a single-line list",
})

const rule = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never", "always-single-line", "never-single-line" ],
    })
    if (!validOptions) {
      return
    }

    selectorListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function selectorListCommaWhitespaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkRules(rule => {
    if (!isStandardSyntaxRule(rule)) {
      return
    }
    const selector = rule.selector
    styleSearch({
      source: selector,
      target: ",",
      functionArguments: "skip",
    }, match => {
      checkDelimiter(selector, match.startIndex, rule)
    })
  })

  function checkDelimiter(source, index, node) {
    locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index,
      result,
      ruleName: checkedRuleName,
    }),
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
