import {
  isStandardSyntaxRule,
  parseSelector,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "selector-attribute-operator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: (operator) => `Expected single space after "${operator}"`,
  rejectedAfter: (operator) => `Unexpected whitespace after "${operator}"`,
})

export default function (expectation) {
  return (root, result) => {
    const checker = whitespaceChecker("space", expectation, messages)
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    selectorAttributeOperatorSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      checkBeforeOperator: false,
    })
  }
}

export function selectorAttributeOperatorSpaceChecker({
  locationChecker,
  root,
  result,
  checkedRuleName,
  checkBeforeOperator,
}) {
  root.walkRules(rule => {
    if (!isStandardSyntaxRule(rule)) { return }
    if (rule.selector.indexOf("[") === -1
      || rule.selector.indexOf("=") === -1
    ) { return }

    parseSelector(rule.selector, result, rule, selectorTree => {
      selectorTree.walkAttributes(attributeNode => {
        const operator = attributeNode.operator

        if (!operator) { return }

        const attributeNodeString = attributeNode.toString()

        styleSearch({ source: attributeNodeString, target: operator }, match => {
          const index = checkBeforeOperator ? match.startIndex : match.endIndex - 1
          checkOperator(
            attributeNodeString,
            index,
            rule,
            attributeNode.sourceIndex,
            operator
          )
        })
      })
    })

    function checkOperator(source, index, node, attributeIndex, operator) {
      locationChecker({
        source,
        index,
        err: (m) => report({
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
