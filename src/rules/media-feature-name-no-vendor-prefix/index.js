const isAutoprefixable = require("../../utils/isAutoprefixable")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "media-feature-name-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected vendor-prefix",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkAtRules(/^media$/i, atRule => {
      const params = atRule.params

      if (!isAutoprefixable.mediaFeatureName(params)) {
        return
      }
      const matches = atRule.toString().match(/[a-z-]+device-pixel-ratio/ig)
      matches.forEach(match => {
        report({
          message: messages.rejected,
          node: atRule,
          word: match,
          result,
          ruleName,
        })
      })
    })
  }
}
