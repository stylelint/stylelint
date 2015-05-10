import charBefore from "../../utils/charBefore"

export const ruleName = "block-opening-brace-before"
export const messages = {
  expected: w => (
    `Expected ${(w === "space") ? "single space" : w} ` +
    `before block (${ruleName})`
  ),
}

const whitespaceKeywordMap = {
  space: " ",
  newline: "\n",
}

/**
 * @param {string} whitespaceKeyword - Whitespace
 *   expected before every block's `{`. One of the
 *   `whitespaceKeywordMap` defined above.
 */
export default function (whitespaceKeyword) {
  return function (css, result) {

    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()

      // There should not be whitespace two characters before the `{`
      if (/\s/.test(charBefore(blockString, "{", 2))) {
        warn()
        return
      }

      const expectedChar = whitespaceKeywordMap[whitespaceKeyword]
      const actualChar = charBefore(blockString, "{")
      if (actualChar !== expectedChar) {
        warn()
      }

      function warn() {
        result.warn(
          messages.expected(whitespaceKeyword),
          { node: block }
        )
      }
    }
  }
}
