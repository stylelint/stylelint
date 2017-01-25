"use strict"

const _ = require("lodash")
const declarationValueIndex = require("../../utils/declarationValueIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const keywordSets = require("../../reference/keywordSets")
const postcss = require("postcss")
const valueParser = require("postcss-value-parser")

const ruleName = "time-min-milliseconds"

const messages = ruleMessages(ruleName, {
  expected: time => `Expected no less than ${time} milliseconds`,
})

const rule = function (minimum) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: minimum,
      possible: _.isNumber,
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      if (keywordSets.longhandTimeProperties.has(postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
        if (isNotAcceptableTime(decl.value)) {
          complain(decl)
        }
      }

      if (keywordSets.shorthandTimeProperties.has(postcss.vendor.unprefixed(decl.prop.toLowerCase()))) {
        const valueList = postcss.list.space(decl.value)

        for (const value of valueList) {
          if (isNotAcceptableTime(value)) {
            complain(decl, decl.value.indexOf(value))
          }
        }
      }
    })

    function isNotAcceptableTime(time) {
      const parsedTime = valueParser.unit(time)

      if (!parsedTime) return false

      const absoluteTime = Math.abs(parsedTime.number)

      if (parsedTime.unit.toLowerCase() === "ms" && absoluteTime <= minimum) {
        return true
      }

      if (parsedTime.unit.toLowerCase() === "s" && absoluteTime * 1000 <= minimum) {
        return true
      }

      return false
    }

    function complain(decl) {
      const offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0

      report({
        result,
        ruleName,
        message: messages.expected(minimum),
        index: declarationValueIndex(decl) + offset,
        node: decl,
      })
    }
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
