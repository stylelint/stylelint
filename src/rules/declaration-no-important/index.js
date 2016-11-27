const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "declaration-no-important"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected !important",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      if (!decl.important) {
        return
      }

      report({
        message: messages.rejected,
        node: decl,
        word: "important",
        result,
        ruleName,
      })
    })
  }
}
