const beforeBlockString = require("../../utils/beforeBlockString")
const hasEmptyBlock = require("../../utils/hasEmptyBlock")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "block-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty block",
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      if (!hasEmptyBlock(statement)) {
        return
      }

      let index = beforeBlockString(statement, { noRawBefore: true }).length

      // For empty blocks when using SugarSS parser
      if (statement.raws.between === undefined) {
        index--
      }

      report({
        message: messages.rejected,
        node: statement,
        index,
        result,
        ruleName,
      })
    }
  }
}
