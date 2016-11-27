const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "selector-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty selector",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      let index = 0

      rule.selector.split(",").forEach(item => {
        index += item.length + 1

        if (item.trim() !== "") {
          return
        }

        report({
          message: messages.rejected,
          node: rule,
          index: index - 1,
          ruleName,
          result,
        })
      })
    })
  }
}
