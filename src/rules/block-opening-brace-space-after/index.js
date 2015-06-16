import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"{\"",
  rejectedAfter: () => "Unexpected space after \"{\"",
  expectedAfterSingleLine: () => "Expected single space after \"{\" of a single-line block",
  rejectedAfterSingleLine: () => "Unexpected space after \"{\" of a single-line block",
  expectedAfterMultiLine: () => "Expected single space after \"{\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected space after \"{\" of a multi-line block",
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
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {

      // return early if an empty block
      if (block.nodes === undefined || block.nodes.length === 0) { return }

      const blockString = block.toString()
      for (let i = 0, l = blockString.length; i < l; i++) {
        if (blockString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkBrace(blockString, i, block, blockString.slice(i))
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
