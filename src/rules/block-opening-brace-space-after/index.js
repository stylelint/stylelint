import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after "{"`,
  rejectedAfter: () => `Unexpected whitespace after "{"`,
  expectedAfterSingleLine: () => `Expected single space after "{" of a single-line block`,
  rejectedAfterSingleLine: () => `Unexpected whitespace after "{" of a single-line block`,
  expectedAfterMultiLine: () => `Expected single space after "{" of a multi-line block`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "{" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return (root, result) => {

    // Check both kinds of statements: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {
      // Return early if blockless or has empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      checker.after({
        source: cssStatementBlockString(statement),
        index: 0,
        err: m => {
          report({
            message: m,
            node: statement,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
