const isAutoprefixable = require("../../utils/isAutoprefixable")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected vendor-prefix "${selector}"`,
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      const selector = rule.selector

      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          if (isAutoprefixable.selector(pseudoNode.value)) {
            report({
              result,
              ruleName,
              message: messages.rejected(pseudoNode.value),
              node: rule,
              index: rule.raws.before.length + pseudoNode.sourceIndex,
            })
          }
        })
      })
    })
  }
}
