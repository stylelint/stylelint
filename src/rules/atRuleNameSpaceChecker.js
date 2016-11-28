const isStandardSyntaxAtRule = require("../../utils/isStandardSyntaxAtRule")
const report = require("../../utils/report")

module.exports = function (_ref) {
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
