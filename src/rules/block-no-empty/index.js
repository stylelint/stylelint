import {
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "block-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected empty block`,
})

export default function () {
  return (root, result) => {

    // Check both kinds of statements: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {
      if (cssStatementHasBlock(statement) && cssStatementHasEmptyBlock(statement)) {
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
