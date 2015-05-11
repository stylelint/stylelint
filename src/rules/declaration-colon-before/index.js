import charNeighbor from "../../utils/charNeighbor"

export const ruleName = "declaration-colon-before"
export const messages = {
  expected: w => (
    `Expected ${(w === "space") ? "single space" : w} ` +
    `before declaration colon (${ruleName})`
  ),
}

const whitespaceKeywordMap = {
  space: " ",
  nothing: "",
}

/**
 * @param {string} whitespaceKeyword - Whitespace
 *   expected before every declarations's `:`. One of the
 *   `whitespaceKeywordMap` defined above.
 */
export default function (whitespaceKeyword) {
  return function (css, result) {

    css.eachDecl(function (decl) {

      const between = decl.between

      // There should not be whitespace two characters before the `:`
      if (/\s/.test(charNeighbor(between, ":", -2))) {
        warn()
        return
      }

      const expectedChar = whitespaceKeywordMap[whitespaceKeyword]
      const actualChar = charNeighbor(between, ":") === undefined ? "" : charNeighbor(between, ":")

      if (actualChar !== expectedChar) {
        warn()
      }

      function warn() {
        result.warn(
          messages.expected(whitespaceKeyword),
          { node: decl }
        )
      }
    })
  }
}
