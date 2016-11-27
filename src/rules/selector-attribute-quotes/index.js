const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-attribute-quotes"

export const messages = ruleMessages(ruleName, {
  expected: value => `Expected quotes around "${value}"`,
  rejected: value => `Unexpected quotes around "${value}"`,
})

module.exports = function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      if (rule.selector.indexOf("[") === -1 || rule.selector.indexOf("=") === -1) {
        return
      }

      parseSelector(rule.selector, result, rule, selectorTree => {
        selectorTree.walkAttributes(attributeNode => {
          if (!attributeNode.operator) {
            return
          }

          const attributeSelectorString = attributeNode.toString()

          if (!attributeNode.quoted && expectation === "always") {
            complain(messages.expected(attributeNode.raws.unquoted), attributeNode.sourceIndex + attributeSelectorString.indexOf(attributeNode.value))
          }

          if (attributeNode.quoted && expectation === "never") {
            complain(messages.rejected(attributeNode.raws.unquoted), attributeNode.sourceIndex + attributeSelectorString.indexOf(attributeNode.value))
          }
        })
      })

      function complain(message, index) {
        report({
          message,
          index,
          result,
          ruleName,
          node: rule,
        })
      }
    })
  }
}
