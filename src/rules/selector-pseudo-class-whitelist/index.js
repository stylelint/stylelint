const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
import { vendor } from "postcss"

export const ruleName = "selector-pseudo-class-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected pseudo-class "${selector}"`,
})

function rule(whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isString],
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      const selector = rule.selector

      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      if (selector.indexOf(":") === -1) {
        return
      }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const value = pseudoNode.value

          // Ignore pseudo-elements

          if (value.slice(0, 2) === "::") {
            return
          }

          const name = value.slice(1)

          if (matchesStringOrRegExp(vendor.unprefixed(name).toLowerCase(), whitelist)) {
            return
          }

          report({
            index: pseudoNode.sourceIndex,
            message: messages.rejected(name),
            node: rule,
            result,
            ruleName,
          })
        })
      })
    })
  }
}

rule.primaryOptionArray = true

module.exports = rule
