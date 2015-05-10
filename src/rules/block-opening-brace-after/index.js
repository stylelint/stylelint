import charNeighbor from "../../utils/charNeighbor"
import isSingleLineString from "../../utils/isSingleLineString"

export const ruleName = "block-opening-brace-after"
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
 * Below, "whitespace" should be a string matching
 * one of the `whitespaceKeywordMap` defined above.
 *
 * @param {string|object} options -
 *   If string: Whitespace expected after every block's `{`.
 *   If object: The following options
 * @param {string} [options.singleLine] - Whitespace expected
 *   after single-line blocks' `{`
 * @param {string} [options.multiLine] - Whitespace expected
 *   after multi-line blocks' `{`
 */
export default function (options) {
  const oneWhitespace = (typeof options === "string")
  const singleLineWhitespaceKeyword = (oneWhitespace)
    ? options
    : options.singleLine
  const multiLineWhitespaceKeyword = (oneWhitespace)
    ? options
    : options.multiLine

  return function (css, result) {

    // Check both kinds of "block": rules and at-rules
    css.eachRule(checkBlock)
    css.eachAtRule(checkBlock)

    function checkBlock(block) {
      const blockString = block.toString()

      const expectedWhitespaceKeyword = (isSingleLineString(blockString))
        ? singleLineWhitespaceKeyword
        : multiLineWhitespaceKeyword

      const expectedChar = whitespaceKeywordMap[expectedWhitespaceKeyword]
      const actualChar = charNeighbor(blockString, "{", 1)

      if (actualChar === expectedChar) { return }
      result.warn(
        messages.expected(expectedWhitespaceKeyword),
        { node: block }
      )
    }
  }
}
