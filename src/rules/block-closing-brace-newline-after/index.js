import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after "}"`,
  expectedAfterSingleLine: () => `Expected single space after "}" of a single-line block`,
  rejectedAfterSingleLine: () => `Unexpected whitespace after "}" of a single-line block`,
  expectedAfterMultiLine: () => `Expected single space after "}" of a multi-line block`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "}" of a multi-line block`,
})

/**
 * @param {"always"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return function (css, result) {

    // Check both kinds of statements: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {
      const nextNode = statement.next()
      if (!nextNode) { return }

      const statementString = statement.toString()

      // Sometimes at-rules do not have blocks (e.g. @import or @extend)
      const openingBraceIndex = statementString.indexOf("{")
      if (openingBraceIndex === -1) { return }

      const blockString = statementString.slice(openingBraceIndex)

      // Only check one after, because there might be other
      // spaces handled by the indentation rule
      checker.afterOneOnly({
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
