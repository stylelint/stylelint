"use strict"

const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const valueParser = require("postcss-value-parser")

const ruleName = "number-no-trailing-zeros"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected trailing zero(s)",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkAtRules(atRule => {
      if (atRule.name.toLowerCase() === "import") {
        return
      }

      check(atRule, atRule.params, atRuleParamIndex)
    })

    root.walkDecls(decl => check(decl, decl.value, declarationValueIndex))

    function check(node, value, getIndex) {
      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) {
        return
      }

      valueParser(value).walk(valueNode => {
        // Ignore `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") {
          return false
        }

        // Ignore strings, comments, etc
        if (valueNode.type !== "word") {
          return
        }

        const match = /(\.\d*)0+(?:\D|$)/.exec(valueNode.value)

        if (match === null) {
          return
        }

        report({
          message: messages.rejected,
          node,
          index: getIndex(node) + valueNode.sourceIndex + match.index + match[1].length,
          result,
          ruleName,
        })
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
