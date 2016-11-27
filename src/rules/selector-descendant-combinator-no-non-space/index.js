const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { nonSpaceCombinators } from "../../reference/punctuationSets"

export const ruleName = "selector-descendant-combinator-no-non-space"

export const messages = ruleMessages(ruleName, {
  rejected: nonSpaceCharacter => `Unexpected "${nonSpaceCharacter}"`,
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

      parseSelector(selector, result, rule, fullSelector => {
        fullSelector.walkCombinators(combinatorNode => {
          const value = combinatorNode.value

          if (nonSpaceCombinators.has(value)) {
            return
          }
          if (value === " ") {
            return
          }

          report({
            result,
            ruleName,
            message: messages.rejected(value),
            node: rule,
            index: combinatorNode.sourceIndex,
          })
        })
      })
    })
  }
}
