const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const report = require("../../utils/report")
const styleSearch = require("style-search")

module.exports = function (_ref) {
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
