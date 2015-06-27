import {
  blockString,
  hasBlock,
  hasEmptyBlock,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before "}"`,
  rejectedBefore: () => `Unexpected whitespace before "}"`,
  expectedBeforeSingleLine: () => `Expected single space before "}" of a single-line block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "}" of a single-line block`,
  expectedBeforeMultiLine: () => `Expected single space before "}" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "}" of a multi-line block`,
})

/**
 * @param {
 *     "always"|"never"
 *     |"always-single-line"|"never-single-line"
 *     |"always-multi-line"|"never-multi-line"
 *   } expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return (root, result) => {

    // Check both kinds of statement: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const source = blockString(statement)

      checker.before({
        source,
        index: source.length - 1,
        err: msg => {
          report({
            message: msg,
            node: statement,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
