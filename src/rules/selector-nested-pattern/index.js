import { isRegExp, isString } from "lodash"
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-nested-pattern"

export const messages = ruleMessages(ruleName, {
  expected: selector => `Expected nested selector "${selector}" to match specified pattern`,
})

module.exports = function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) {
      return
    }

    const normalizedPattern = isString(pattern) ? new RegExp(pattern) : pattern

    root.walkRules(rule => {
      if (rule.parent.type !== "rule") {
        return
      }
      if (!isStandardSyntaxRule(rule)) {
        return
      }

      const selector = rule.selector

      if (!isStandardSyntaxSelector(selector)) {
        return
      }

      if (normalizedPattern.test(selector)) {
        return
      }

      report({
        result,
        ruleName,
        message: messages.expected(selector),
        node: rule,
      })
    })
  }
}
