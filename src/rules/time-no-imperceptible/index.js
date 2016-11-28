const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const keywordSets = require("../../reference/keywordSets")
const postcss = require("postcss")
const valueParser = require("postcss-value-parser")

export const ruleName = "time-no-imperceptible"

export const messages = ruleMessages(ruleName, {
  rejected: time => `Unexpected time value "${time}" less than or equal to 100ms`,
})

const MINIMUM_MILLISECONDS = 100

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      if (keywordSets.longhandTimeProperties.has(postcss.postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
        if (isImperceptibleTime(decl.value)) {
          complain(messages.rejected(decl.value), decl)
        }
      }

      if (keywordSets.shorthandTimeProperties.has(postcss.postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
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
