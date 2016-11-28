"use strict"

const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const declarationValueIndex = require("../../utils/declarationValueIndex")
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const validateObjectWithStringArrayProps = require("../../utils/validateObjectWithStringArrayProps")
const valueParser = require("postcss-value-parser")

const ruleName = "unit-blacklist"

const messages = ruleMessages(ruleName, {
  rejected: unit => `Unexpected unit "${unit}"`,
})

const rule = function (blacklistInput, options) {
  const blacklist = [].concat(blacklistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [_.isString],
    }, {
      optional: true,
      actual: options,
      possible: {
        ignoreProperties: validateObjectWithStringArrayProps,
      },
    })
    if (!validOptions) {
      return
    }

    function check(node, value, getIndex) {
      valueParser(value).walk(function (valueNode) {
        // Ignore wrong units within `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") {
          return false
        }

        const unit = getUnitFromValueNode(valueNode)

        if (!unit || unit && blacklist.indexOf(unit.toLowerCase()) === -1) {
          return
        }

        if (options && optionsMatches(options.ignoreProperties, unit.toLowerCase(), node.prop)) {
          return
        }

        report({
          index: getIndex(node) + valueNode.sourceIndex,
          message: messages.rejected(unit),
          node,
          result,
          ruleName,
        })
      })
    }

    root.walkAtRules(/^media$/i, atRule => check(atRule, atRule.params, atRuleParamIndex))
    root.walkDecls(decl => check(decl, decl.value, declarationValueIndex))
  }
}

rule.primaryOptionArray = true

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
