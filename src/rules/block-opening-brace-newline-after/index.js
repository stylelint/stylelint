import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \"{\"",
  rejectedAfter: () => "Unexpected space after \"{\"",
  expectedAfterMultiLine: () => "Expected newline after \"{\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected space after \"{\" of a multi-line block",
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
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {

      // return early if an empty block
      if (block.nodes.length === 0) { return }

      const blockString = block.toString()
      for (let i = 0, l = blockString.length; i < l; i++) {
        if (blockString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkBrace(blockString, i, block, blockString.slice(i))
        break
      }
    }

    function checkBrace(str, index, node, lineCheckStr) {
      checkLocation(str, index, m => result.warn(m, { node }), lineCheckStr)
    }
  }
}
