import {
  hasBlock,
  hasEmptyBlock,
  ruleMessages,
  report,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "{"`,
  rejectedBefore: () => `Unexpected newline before "{"`,
  expectedBeforeSingleLine: () => `Expected newline before "{" of a single-line block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line block`,
  expectedBeforeMultiLine: () => `Expected newline before "{" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)

  return function (css, result) {

    // Check both kinds of statement: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const strBeforeOpeningBrace = (statement.type === "rule")
        ? statement.selector + statement.between
        : "@" + statement.name + statement.afterName + statement.params + statement.between

      // The string to check for multi-line vs single-line is the block:
      // the curly braces and everything between them
      const lineCheckStr = statement.toString().slice(strBeforeOpeningBrace.length)

      checker.before({
        lineCheckStr,
        source: strBeforeOpeningBrace.toString(),
        index: strBeforeOpeningBrace.length,
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
