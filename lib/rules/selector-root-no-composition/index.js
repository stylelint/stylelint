"use strict"

const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "selector-root-no-composition"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected composition",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    result.warn((
      `'${ruleName}' has been deprecated and in 8.0 will be removed. Instead use the community 'stylelint-suitcss' plugin pack.`
    ), {
      stylelintType: "deprecation",
      stylelintReference: `https://stylelint.io/user-guide/rules/${ruleName}/`,
    })

    root.walkRules(rule => {
      if (rule.selector.toLowerCase().indexOf(":root") === -1 || rule.selector.toLowerCase().trim() === ":root") {
        return
      }

      report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
