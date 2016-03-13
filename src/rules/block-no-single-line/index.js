import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementStringBeforeBlock,
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
      if (!cssStatementHasBlock(statement)) { return }
      if (!isSingleLineString(cssStatementBlockString(statement))) { return }

      report({
        message: messages.rejected,
        node: statement,
        index: cssStatementStringBeforeBlock(statement, { noBefore: true }).length,
        result,
        ruleName,
      })
    }
  }
}
