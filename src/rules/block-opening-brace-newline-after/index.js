import {
  hasBlock,
  hasEmptyBlock,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after "{"`,
  rejectedAfter: () => `Unexpected space after "{"`,
  expectedAfterMultiLine: () => `Expected newline after "{" of a multi-line block`,
  rejectedAfterMultiLine: () => `Unexpected space after "{" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return blockOpeningBraceNewlineChecker(checker.afterOneOnly)
}

export function blockOpeningBraceNewlineChecker(checkLocation) {
  return function (css, result) {

    // Check both kinds of statement: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {

      // return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const statementString = statement.toString()
      for (let i = 0, l = statementString.length; i < l; i++) {
        if (statementString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkBrace(statementString, i, statement, statementString.slice(i))
        break
      }
    }

    function checkBrace(str, index, node, lineCheckStr) {
      checkLocation(str, index, m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        }), lineCheckStr)
    }
  }
}
