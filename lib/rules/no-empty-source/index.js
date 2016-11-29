"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "no-empty-source"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty source",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    if (!/^\s*$/.test(root.toString())) {
      return
    }

    report({
      message: messages.rejected,
      node: root,
      result,
      ruleName,
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
