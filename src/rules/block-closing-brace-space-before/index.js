import {
  hasBlock,
  hasEmptyBlock,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before "}"`,
  rejectedBefore: () => `Unexpected space before "}"`,
  expectedBeforeSingleLine: () => `Expected single space before "}" of a single-line block`,
  rejectedBeforeSingleLine: () => `Unexpected space before "}" of a single-line block`,
  expectedBeforeMultiLine: () => `Expected single space before "}" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected space before "}" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {

    // Check both kinds of statement: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {

      // return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const statementString = statement.toString()

      // Sometimes at-rules do not have blocks (e.g. @import or @extend)
      const openingBraceIndex = statementString.indexOf("{")
      if (openingBraceIndex === -1) { return }
      const blockString = statementString.slice(openingBraceIndex)

      checker.before(blockString, blockString.length - 1, msg => {
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
