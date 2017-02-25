"use strict"

const blockString = require("../../utils/blockString")
const hasBlock = require("../../utils/hasBlock")
const rawNodeString = require("../../utils/rawNodeString")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")

const ruleName = "at-rule-semicolon-space-before"

const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \";\"",
  rejectedBefore: () => "Unexpected whitespace before \";\"",
})

const rule = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) {
      return
    }

    root.walkAtRules(atRule => {
      if (hasBlock(atRule)) {
        return
      }
      const parentRule = atRule.parent

      checker.before({
        source: rawNodeString(atRule),
        index: rawNodeString(atRule).length,
        lineCheckStr: blockString(parentRule),
        err: m => {
          // console.log(rawNodeString(atRule))
          report({
            message: m,
            node: atRule,
            index: rawNodeString(atRule).length - 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
