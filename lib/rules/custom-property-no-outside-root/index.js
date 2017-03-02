"use strict"

const isCustomProperty = require("../../utils/isCustomProperty")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "custom-property-no-outside-root"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected custom property",
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
      // Ignore rules whose selector is just `:root`
      if (rule.selector.toLowerCase().trim() === ":root") {
        return
      }

      rule.walkDecls(decl => {
        if (!isCustomProperty(decl.prop)) {
          return
        }
        report({
          message: messages.rejected,
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
