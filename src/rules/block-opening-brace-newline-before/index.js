import {
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  ruleMessages,
  report,
  cssStatementStringBeforeBlock,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "{"`,
  expectedBeforeSingleLine: () => `Expected newline before "{" of a single-line block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line block`,
  expectedBeforeMultiLine: () => `Expected newline before "{" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line block`,
})

/**
 * @param {"always"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)

  return (root, result) => {

    // Check both kinds of statement: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      const beforeBrace = cssStatementStringBeforeBlock(statement)

      // The string to check for multi-line vs single-line is the block:
      // the curly braces and everything between them
      const lineCheckStr = statement.toString().slice(beforeBrace.length)

      checker.beforeAllowingIndentation({
        lineCheckStr,
        source: beforeBrace,
        index: beforeBrace.length,
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
