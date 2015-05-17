import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"}\"",
  rejectedAfter: () => "Unexpected space after \"}\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const nextNode = block.next()
      if (!nextNode) { return }
      checker.after(nextNode.toString(), -1, msg => {
        result.warn(msg, { node: block })
      })
    }
  }
}
