import {
  cssStatementHasEmptyBlock,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "block-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected empty block`,
})

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: o })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {
      if (cssStatementHasEmptyBlock(statement)) {
        report({
          message: messages.rejected,
          node: statement,
          result,
          ruleName,
        })
      }
    }
  }
}
