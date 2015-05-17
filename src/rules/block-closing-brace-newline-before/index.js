import { ruleMessages } from "../../utils"

export const ruleName = "block-closing-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single newline before \"}\"",
  rejectedBefore: () => "Unexpected newline before \"}\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      // We're really just checking whether a
      // newline *starts* the block's final space -- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (expectation === "always" && block.after[0] !== "\n") {
        result.warn(messages.expectedBefore(), { node: block })
      }
      if (expectation === "never" && block.after) {
        result.warn(messages.rejectedBefore(), { node: block })
      }
    }
  }
}
