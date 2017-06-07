"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "stylelint-disable-no-empty"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty `stylelint-disable` comment",
})

const stylelintDisableCommand = "stylelint-disable"

const rule = (actual) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkComments((comment) => {
      if (!isDisableCommand(comment.text)) {
        return
      }

      const specificRules = comment.text.split(" ", 2).slice(1)

      if (specificRules.length > 0) {
        return
      }

      const disabledRanges = result.stylelint.disabledRanges
      result.stylelint.disabledRanges = false

      report({
        message: messages.rejected,
        node: comment,
        result,
        ruleName,
      })

      result.stylelint.disabledRanges = disabledRanges
    })

    function isDisableCommand(text) {
      return text.indexOf(stylelintDisableCommand) === 0
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
