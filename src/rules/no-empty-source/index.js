const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "no-empty-source"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty source",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    if (!/^\s*$/.test(root.toString())) {
      return
    }

    report({
      message: messages.rejected,
      node: root,
      result,
      ruleName,
    })
  }
}
