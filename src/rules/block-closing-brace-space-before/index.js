import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"}\"",
  rejectedBefore: () => "Unexpected space before \"}\"",
  expectedBeforeSingleLine: () => "Expected single space before \"}\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected space before \"}\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected single space before \"}\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected space before \"}\" of a multi-line block",
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {

      // return early if an empty block
      if (block.nodes.length === 0) { return }

      const blockString = block.toString()
      const blockStringNoSelector = blockString.slice(blockString.indexOf("{"))
      checker.before(blockString, blockString.length - 1, msg => {
        report({
          message: msg,
          node: block,
          result,
          ruleName,
        })
      }, blockStringNoSelector)
    }
  }
}
