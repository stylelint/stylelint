import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-closing-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \"}\"",
  rejectedAfter: () => "Unexpected space after \"}\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const nextNode = block.next()
      if (!nextNode) { return }

      // Only check one after, because there might be other
      // spaces handled by the indentation rule
      checker.afterOneOnly(nextNode.toString(), -1, msg => {
        result.warn(msg, { node: block })
      })
    }
  }
}
