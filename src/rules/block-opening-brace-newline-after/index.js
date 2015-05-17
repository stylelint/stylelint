import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single newline after \"{\"",
  rejectedAfter: () => "Unexpected newline after \"{\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return blockOpeningBraceNewlineChecker(checker.afterOneOnly)
}

export function blockOpeningBraceNewlineChecker(locationChecker) {
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()
      for (let i = 0, l = blockString.length; i < l; i++) {
        if (blockString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkLocation(blockString, i, block)
        break
      }
    }

    function checkLocation(str, index, node) {
      locationChecker(str, index, m => result.warn(m, { node }))
    }
  }
}
