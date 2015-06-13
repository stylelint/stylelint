import {
  ruleMessages,
  report
} from "../../utils"

export const ruleName = "block-no-empty"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected empty block",
})

export default function () {
  return function (css, result) {

    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      if (block.nodes.length === 0) {
        report({
          message: messages.rejected,
          node: block,
          result,
          ruleName,
        })
      }
    }
  }
}
