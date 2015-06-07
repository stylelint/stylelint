import {
  ruleMessages,
  isWhitespace,
  styleSearch
} from "../../utils"

export const ruleName = "function-space-after"

export const messages = ruleMessages(ruleName, {
  expected: "Expected single space after \")\"",
  rejected: "Unexpected space after \")\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: ")" }, match => {
        checkClosingParen(value, match.startIndex, decl)
      })
    })

    function checkClosingParen(source, index, node) {
      const nextChar = source[index + 1]
      if (expectation === "always") {
        // Allow for the next character to be a single empty space,
        // another closing parenthesis, a comma, or the end of the value
        if (nextChar === " " && !isWhitespace(source[index + 2])) { return }
        if ([ ")", ",", undefined ].indexOf(nextChar) !== -1) { return }
        result.warn(messages.expected, { node })
      } else if (expectation === "never") {
        if (isWhitespace(nextChar)) {
          result.warn(messages.rejected, { node })
        }
      }
    }
  }
}
