import charNeighbor from "../../utils/charNeighbor"

export const ruleName = "declaration-colon-space"
export const messages = {
  expected: (k, v) => (
    `Expected there ${v} to be a space ` +
    `${k} a declaration colon (${ruleName})`
  ),
}

const keyCharOffsetMap = {
  before: -1,
  after: 1
}

const valueKeywordMap = {
  always: " ",
  never: "",
}

/**
 * @param {object} options {
 *   "before": "always"|"never",
 *   "after": "always|never"
 * }
 */
export default function (options) {
  return function (css, result) {

    css.eachDecl(function (decl) {

      if (!options) { return }

      const between = decl.between

      for (let key in options) {
        checkPosition(key);
      }

      function checkPosition(position) {

        // There should not be whitespace two characters before/after the `:`
        if (/\s/.test(charNeighbor(between, ":", 2 * keyCharOffsetMap[position]))) {
          warn(position, options[position]);
          return
        }

        let expectedChar = valueKeywordMap[options[position]]

        let actualChar = charNeighbor(between, ":", keyCharOffsetMap[position])

        actualChar = (actualChar === undefined) ? "" : actualChar

        if (actualChar !== expectedChar) {
          warn(position, options[position]);
        }
      }

      function warn(key, value) {
        result.warn(
          messages.expected(key, value),
          { node: decl }
        )
      }
    })
  }
}
