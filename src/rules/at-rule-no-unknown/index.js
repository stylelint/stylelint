const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { atRules } from "../../reference/keywordSets"
const _ = require("lodash")
import { vendor } from "postcss"

export const ruleName = "at-rule-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: atRule => `Unexpected unknown at-rule "${atRule}"`,
})

module.exports = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreAtRules: [_.isString],
      },
      optional: true,
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules(atRule => {
      const name = atRule.name

      // Return early if at-rule is to be ignored

      if (optionsMatches(options, "ignoreAtRules", atRule.name)) {
        return
      }

      if (vendor.prefix(name) || atRules.has(name.toLowerCase())) {
        return
      }

      report({
        message: messages.rejected(`@${name}`),
        node: atRule,
        ruleName,
        result,
      })
    })
  }
}
