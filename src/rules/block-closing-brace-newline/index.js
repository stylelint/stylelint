import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "block-closing-brace-newline"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected newline before closing "}"`,
  rejectedBefore: () => `Unexpected space before closing "}"`,
  expectedAfter: () => `Expected newline after closing "}"`,
  rejectedAfter: () => `Unexpected space after closing "}"`,
})

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  const spaceOptions = standardWhitespaceOptions(options)
  const spaceChecker = standardWhitespaceChecker("\n", spaceOptions, messages)

  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      // For "before" we're really just checking whether a
      // newline *starts* the block's final space --- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (spaceOptions.expectBefore && block.after[0] !== "\n") {
        result.warn(messages.expectedBefore(), { node: block })
      }
      if (spaceOptions.rejectBefore && block.after) {
        result.warn(messages.rejectedBefore(), { node: block })
      }

      const nextNode = block.next()
      if (!nextNode) { return }

      // Only check one after, because there might be other
      // spaces handled by the indentation rule
      spaceChecker.oneAfter(nextNode.toString(), -1, msg => {
        result.warn(msg, { node: block })
      })
    }
  }
}
