import {
  standardWhitespaceOptions,
  standardWhitespaceChecker,
  standardWhitespaceMessages
} from "../../utils"

export const ruleName = "block-opening-brace-space"

export const messages = standardWhitespaceMessages(ruleName, {
  expectedBefore: () => `Expected single space before opening "{"`,
  rejectedBefore: () => `Unexpected space before opening "{"`,
  expectedAfter: () => `Expected single space after opening "{"`,
  rejectedAfter: () => `Unexpected space after opening "{"`,
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
      for (let i = 0, l = blockString.length; i < l; i++) {
        if (blockString[i] !== "{") { continue }
        // Only pay attention to the first brace encountered
        checkBrace(i)
        break
      }

      function checkBrace(index) {
        spaceChecker.before(blockString, index, msg => {
          result.warn(msg, { node: block })
        })
        spaceChecker.after(blockString, index, msg => {
          result.warn(msg, { node: block })
        })
      }
    }
  }
}
