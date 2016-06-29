import {
  hasEmptyBlock,
  beforeBlockString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "block-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty block",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      if (!hasEmptyBlock(statement)) { return }

      let index = beforeBlockString(statement, { noRawBefore: true }).length

      // For empty blocks when using SugarSS parser
      if (statement.raw("between") === undefined) {
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
