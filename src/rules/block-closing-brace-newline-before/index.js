import {
  ruleMessages,
  isSingleLineString
} from "../../utils"

export const ruleName = "block-closing-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected newline before \"}\"",
  rejectedBefore: () => "Unexpected space before \"}\"",
  expectedBeforeMultiLine: () => "Expected newline before \"}\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected space before \"}\" of a multi-line block",
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {

      // return early if an empty block
      if (block.nodes.length === 0) { return }

      const blockString = block.toString()
      const blockStringNoSelector = blockString.slice(blockString.indexOf("{"))
      const blockIsMultiLine = !isSingleLineString(blockStringNoSelector)

      // We're really just checking whether a
      // newline *starts* the block's final space -- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (block.after[0] !== "\n") {
        if (expectation === "always") {
          result.warn(messages.expectedBefore(), { node: block })
        } else if (blockIsMultiLine && expectation === "always-multi-line") {
          result.warn(messages.expectedBeforeMultiLine(), { node: block })
        }
      }
      if (block.after) {
        if (expectation === "never") {
          result.warn(messages.rejectedBefore(), { node: block })
        } else if (blockIsMultiLine && expectation === "never-multi-line") {
          result.warn(messages.rejectedBeforeMultiLine(), { node: block })
        }
      }
    }
  }
}
