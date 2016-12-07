"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const keywordSets = require("../../reference/keywordSets")
const styleSearch = require("style-search")

const ruleName = "selector-pseudo-element-colon-notation"

const messages = ruleMessages(ruleName, {
  expected: q => `Expected ${q} colon pseudo-element notation`,
})

const rule = function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "single",
        "double",
      ],
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }
      const selector = rule.selector

      // get out early if no pseudo elements or classes
      if (selector.indexOf(":") === -1) {
        return
      }

      // match only level 1 and 2 pseudo elements
      const pseudoElementsWithColons = _.toArray(keywordSets.levelOneAndTwoPseudoElements).map(x => `:${x}`)
      styleSearch({ source: selector.toLowerCase(), target: pseudoElementsWithColons }, match => {
        const prevCharIsColon = selector[match.startIndex - 1] === ":"

        if (expectation === "single" && !prevCharIsColon) {
          return
        }
        if (expectation === "double" && prevCharIsColon) {
          return
        }

        report({
          message: messages.expected(expectation),
          node: rule,
          index: match.startIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
