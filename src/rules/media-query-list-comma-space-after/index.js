const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const styleSearch = require("style-search")

const ruleName = "media-query-list-comma-space-after"

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
    mediaQueryListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function mediaQueryListCommaWhitespaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkAtRules(/^media$/i, atRule => {
    const params = atRule.params
    styleSearch({ source: params, target: "," }, match => {
      checkComma(params, match.startIndex, atRule)
    })
  })

  function checkComma(source, index, node) {
    locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index: index + atRuleParamIndex(node),
      result,
      ruleName: checkedRuleName,
    }),
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
