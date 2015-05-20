import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"}\"",
  rejectedAfter: () => "Unexpected space after \"}\"",
  expectedAfterMultiLine: () => "Expected single space after \"}\" of a multi-line block",
})

/**
 * @param {"always"|"never"|"always-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()
      const blockStringNoSelector = blockString.slice(blockString.indexOf("{"))
      const nextNode = block.next()
      if (!nextNode) { return }
      checker.after(nextNode.toString(), -1, msg => {
        result.warn(msg, { node: block })
      }, blockStringNoSelector)
    }
  }
}
