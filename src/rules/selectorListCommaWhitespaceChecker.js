const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const report = require("../../utils/report")
const styleSearch = require("style-search")

module.exports = function (_ref) {
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
