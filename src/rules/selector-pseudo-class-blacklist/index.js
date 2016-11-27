const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "selector-pseudo-class-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected pseudo-class "${selector}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
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

          if (!matchesStringOrRegExp(vendor.unprefixed(name).toLowerCase(), blacklist)) {
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
