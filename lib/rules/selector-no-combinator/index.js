"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "selector-no-combinator"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected combinator",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    result.warn((
      `'${ruleName}' has been deprecated and in 8.0 will be removed. Instead use 'selector-max-combinators' with '0' as its primary option.`
    ), {
      stylelintType: "deprecation",
      stylelintReference: `https://stylelint.io/user-guide/rules/${ruleName}/`,
    })

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      const selector = rule.selector

      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkCombinators(combinator => {
          report({
            message: messages.rejected,
            node: rule,
            index: combinator.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
