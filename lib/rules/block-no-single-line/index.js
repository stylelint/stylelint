"use strict"

const beforeBlockString = require("../../utils/beforeBlockString")
const blockString = require("../../utils/blockString")
const hasBlock = require("../../utils/hasBlock")
const hasEmptyBlock = require("../../utils/hasEmptyBlock")
const isSingleLineString = require("../../utils/isSingleLineString")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "block-no-single-line"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected single-line block",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      if (
        !hasBlock(statement)
        || hasEmptyBlock(statement)
      ) {
        return
      }
      if (!isSingleLineString(blockString(statement))) {
        return
      }

      report({
        message: messages.rejected,
        node: statement,
        index: beforeBlockString(statement, { noRawBefore: true }).length,
        result,
        ruleName,
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
