import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after "}"`,
  rejectedAfter: () => `Unexpected space after "}"`,
  expectedAfterMultiLine: () => `Expected single space after "}" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {

    // Check both kinds of statements: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {
      const statementString = statement.toString()
      const blockString = statementString.slice(statementString.indexOf("{"))
      const nextNode = statement.next()
      if (!nextNode) { return }
      checker.after(nextNode.toString(), -1, msg => {
        report({
          message: msg,
          node: statement,
          result,
          ruleName,
        })
      }, blockString)
    }
  }
}
