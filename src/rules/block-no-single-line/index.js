import {
  blockString,
  hasBlock,
  beforeBlockString,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "block-no-single-line"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected single-line block",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      if (!hasBlock(statement)) { return }
      if (!isSingleLineString(blockString(statement))) { return }

      report({
        message: messages.rejected,
        node: statement,
        index: beforeBlockString(statement, { noRawBefore: true }).length,
        result,
        ruleName,
      })
    }
  }
}
