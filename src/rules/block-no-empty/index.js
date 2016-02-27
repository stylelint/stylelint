import {
  cssStatementHasEmptyBlock,
  cssStatementStringBeforeBlock,
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
      if (cssStatementHasEmptyBlock(statement)) {
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
}
