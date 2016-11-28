"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "selector-no-empty"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty selector",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      let index = 0

      rule.selector.split(",").forEach(item => {
        index += item.length + 1

        if (item.trim() !== "") {
          return
        }

        report({
          message: messages.rejected,
          node: rule,
          index: index - 1,
          ruleName,
          result,
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
