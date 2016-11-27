const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-root-no-composition"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected composition",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (rule.selector.toLowerCase().indexOf(":root") === -1 || rule.selector.toLowerCase().trim() === ":root") {
        return
      }

      report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
