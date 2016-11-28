const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const declarationValueIndex = require("../../utils/declarationValueIndex")
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const keywordSets = require("../../reference/keywordSets")
const valueParser = require("postcss-value-parser")

export const ruleName = "unit-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: unit => `Unexpected unknown unit "${unit}"`,
})

module.exports = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreUnits: [_.isString],
      },
      optional: true,
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
        if (!unit) {
          return
        }

        if (optionsMatches(options, "ignoreUnits", unit)) {
          return
        }

        if (keywordSets.units.has(unit.toLowerCase())) {
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
