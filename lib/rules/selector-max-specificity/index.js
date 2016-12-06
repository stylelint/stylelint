"use strict"

const specificity = require("specificity")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const resolvedNestedSelector = require("postcss-resolve-nested-selector")

const ruleName = "selector-max-specificity"

const messages = ruleMessages(ruleName, {
  expected: (selector, specificity) => `Expected "${selector}" to have a specificity no more than "${specificity}"`,
})

const rule = function (max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: [
        function (max) {
        // Check that the max specificity is in the form "a,b,c"
          const pattern = new RegExp("^\\d+,\\d+,\\d+$")
          return pattern.test(max)
        },
      ],
    })
    if (!validOptions) {
      return
    }

    const maxSpecificityArray = ("0," + max).split(",").map(parseFloat)
    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      if (!isStandardSyntaxSelector(rule.selector)) {
        return
      }
      // Using rule.selectors gets us each selector in the eventuality we have a comma separated set
      rule.selectors.forEach(selector => {
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          // Return early if selector contains a not pseudo-class
          if (selector.indexOf(":not(") !== -1) {
            return
          }
          // Return early if selector contains a matches
          if (selector.indexOf(":matches(") !== -1) {
            return
          }
          // Check if the selector specificity exceeds the allowed maximum
          try {
            if (specificity.compare(resolvedSelector, maxSpecificityArray) === 1) {
              report({
                ruleName,
                result,
                node: rule,
                message: messages.expected(resolvedSelector, max),
                word: selector,
              })
            }
          } catch (e) {
            result.warn("Cannot parse selector", { node: rule })
          }
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
