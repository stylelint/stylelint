"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector")
const isCustomSelector = require("../../utils/isCustomSelector")
const optionsMatches = require("../../utils/optionsMatches")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const keywordSets = require("../../reference/keywordSets")
const _ = require("lodash")
const postcss = require("postcss")

const ruleName = "selector-pseudo-class-no-unknown"

const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected unknown pseudo-class selector "${selector}"`,
})

const rule = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignorePseudoClasses: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      const selector = rule.selector

      // Return early before parse if no pseudos for performance

      if (selector.indexOf(":") === -1) {
        return
      }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const value = pseudoNode.value

          if (!isStandardSyntaxSelector(value)) {
            return
          }

          if (isCustomSelector(value)) {
            return
          }

          // Ignore pseudo-elements
          if (value.slice(0, 2) === "::") {
            return
          }

          if (optionsMatches(options, "ignorePseudoClasses", pseudoNode.value.slice(1))) {
            return
          }

          const name = value.slice(1)

          if (postcss.vendor.prefix(name)
            || keywordSets.pseudoClasses.has(name.toLowerCase())
            || keywordSets.pseudoElements.has(name.toLowerCase())
          ) {
            return
          }

          if (pseudoNode.prev()) {
            const prevPseudoNodeValue = postcss.vendor.unprefixed(pseudoNode.prev().value.toLowerCase().slice(2))

            if (keywordSets.webkitProprietaryPseudoElements.has(prevPseudoNodeValue)
              && keywordSets.webkitProprietaryPseudoClasses.has(name.toLowerCase())
            ) {
              return
            }
          }

          report({
            message: messages.rejected(value),
            node: rule,
            index: pseudoNode.sourceIndex,
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
