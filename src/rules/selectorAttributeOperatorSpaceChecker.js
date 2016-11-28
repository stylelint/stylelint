const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const styleSearch = require("style-search")

module.exports = function (_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName,
    checkBeforeOperator = _ref.checkBeforeOperator

  root.walkRules(rule => {
    if (!isStandardSyntaxRule(rule)) {
      return
    }
    if (rule.selector.indexOf("[") === -1 || rule.selector.indexOf("=") === -1) {
      return
    }

    parseSelector(rule.selector, result, rule, selectorTree => {
      selectorTree.walkAttributes(attributeNode => {
        const operator = attributeNode.operator

        if (!operator) {
          return
        }

        const attributeNodeString = attributeNode.toString()

        styleSearch({ source: attributeNodeString, target: operator }, match => {
          const index = checkBeforeOperator ? match.startIndex : match.endIndex - 1
          checkOperator(attributeNodeString, index, rule, attributeNode.sourceIndex, operator)
        })
      })
    })

    function checkOperator(source, index, node, attributeIndex, operator) {
      locationChecker({
        source,
        index,
        err: m => report({
          message: m.replace(checkBeforeOperator ? operator[0] : operator[operator.length - 1], operator),
          node,
          index: attributeIndex + index,
          result,
          ruleName: checkedRuleName,
        }),
      })
    }
  })
}
