const isKeyframeSelector = require("../../utils/isKeyframeSelector")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const isStandardSyntaxTypeSelector = require("../../utils/isStandardSyntaxTypeSelector")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-type-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

module.exports = function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "lower", "upper" ],
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      const selector = rule.selector,
        selectors = rule.selectors

      if (!isStandardSyntaxRule(rule)) {
        return
      }
      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      if (selectors.some(s => isKeyframeSelector(s))) {
        return
      }

      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkTags(tag => {
          if (!isStandardSyntaxTypeSelector(tag)) {
            return
          }

          const sourceIndex = tag.sourceIndex,
            value = tag.value

          const expectedValue = expectation === "lower" ? value.toLowerCase() : value.toUpperCase()

          if (value === expectedValue) {
            return
          }

          report({
            message: messages.expected(value, expectedValue),
            node: rule,
            index: sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}
