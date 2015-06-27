import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after "}"`,
  rejectedAfter: () => `Unexpected whitespace after "}"`,
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

      // Sometimes at-rules do not have blocks (e.g. @import or @extend)
      const openingBraceIndex = statementString.indexOf("{")
      if (openingBraceIndex === -1) { return }
      const blockString = statementString.slice(openingBraceIndex)

      const nextNode = statement.next()
      if (!nextNode) { return }
      checker.after({
        source: nextNode.toString(),
        index: -1,
        err: msg => {
          report({
            message: msg,
            node: statement,
            result,
            ruleName,
          })
        },
        lineCheckStr: blockString,
      })
    }
  }
}
