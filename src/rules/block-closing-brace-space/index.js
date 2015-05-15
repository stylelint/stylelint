import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "block-closing-brace-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before closing "}"`,
  rejectedBefore: () => `Unexpected space before closing "}"`,
  expectedAfter: () => `Expected single space after closing "}"`,
  rejectedAfter: () => `Unexpected space after closing "}"`,
})

/**
 * @param {object} options
 * @param {"always"|"never"} [options.before]
 * @param {"always"|"never"} [options.after]
 */
export default function (options) {
  const spaceOptions = standardWhitespaceOptions(options)
  const spaceChecker = standardWhitespaceChecker(" ", spaceOptions, messages)

  return function (css, result) {
    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()

      spaceChecker.before(blockString, blockString.length - 1, msg => {
        result.warn(msg, { node: block })
      })

      const nextNode = block.next()
      if (!nextNode) { return }
      spaceChecker.after(nextNode.toString(), -1, msg => {
        result.warn(msg, { node: block })
      })
    }
  }
}
