import {
  hasBlock,
  hasEmptyBlock,
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
  return blockOpeningBraceSpaceChecker(checker.after)
}

export function blockOpeningBraceSpaceChecker(checkLocation) {
  return function (css, result) {

    // Check both kinds of statements: rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(statement) {

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

    function checkBrace(source, index, node, lineCheckStr) {
      checkLocation({
        source,
        index,
        lineCheckStr,
        err: m => {
          report({
            message: m,
            node: node,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
