const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { isRegExp, isString } from "lodash"

export const ruleName = "custom-media-pattern"

export const messages = ruleMessages(ruleName, {
  expected: "Expected custom media query name to match specified pattern",
})

module.exports = function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) {
      return
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern

    root.walkAtRules(atRule => {
      if (atRule.name.toLowerCase() !== "custom-media") {
        return
      }

      const customMediaName = atRule.params.match(/^--(\S+)\b/)[1]

      if (regexpPattern.test(customMediaName)) {
        return
      }

      report({
        message: messages.expected,
        node: atRule,
        index: atRuleParamIndex(atRule),
        result,
        ruleName,
      })
    })
  }
}
