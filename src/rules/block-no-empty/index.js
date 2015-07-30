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
    validateOptions({ result, ruleName, actual: o })

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
