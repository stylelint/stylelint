"use strict"

const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const keywordSets = require("../../reference/keywordSets")
const postcss = require("postcss")
const valueParser = require("postcss-value-parser")

const ruleName = "time-no-imperceptible"

const messages = ruleMessages(ruleName, {
  rejected: time => `Unexpected time value "${time}" less than or equal to 100ms`,
})

const MINIMUM_MILLISECONDS = 100

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    result.warn((
      `'${ruleName}' has been deprecated and in 8.0 will be removed. Instead use 'time-min-milliseconds' with '100' as its primary option.`
    ), {
      stylelintType: "deprecation",
      stylelintReference: `https://stylelint.io/user-guide/rules/${ruleName}/`,
    })

    root.walkDecls(decl => {
      if (keywordSets.longhandTimeProperties.has(postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
        if (isImperceptibleTime(decl.value)) {
          complain(messages.rejected(decl.value), decl)
        }
      }

      if (keywordSets.shorthandTimeProperties.has(postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
        const valueList = postcss.list.space(decl.value)
        for (const value of valueList) {
          if (isImperceptibleTime(value)) {
            complain(messages.rejected(value), decl, decl.value.indexOf(value))
          }
        }
      }
    })

    function isImperceptibleTime(time) {
      const parsedTime = valueParser.unit(time)
      if (!parsedTime) return false
      const absoluteTime = Math.abs(parsedTime.number)
      if (parsedTime.unit.toLowerCase() === "ms" && absoluteTime <= MINIMUM_MILLISECONDS) {
        return true
      }
      if (parsedTime.unit.toLowerCase() === "s" && absoluteTime * 1000 <= MINIMUM_MILLISECONDS) {
        return true
      }
      return false
    }

    function complain(message, decl) {
      const offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0

      report({
        result,
        ruleName,
        message,
        index: declarationValueIndex(decl) + offset,
        node: decl,
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
