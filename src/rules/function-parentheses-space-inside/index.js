import {
  isWhitespace,
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "function-parentheses-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: `Expected single space after "("`,
  rejectedOpening: `Unexpected whitespace after "("`,
  expectedClosing: `Expected single space before ")"`,
  rejectedClosing: `Unexpected whitespace before ")"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: "(" }, match => {
        checkOpening(value, match.startIndex, decl)
      })
      styleSearch({ source: value, target: ")" }, match => {
        checkClosing(value, match.startIndex, decl)
      })
    })

    function checkOpening(source, index, node) {
      const nextCharIsSpace = source[index + 1] === " "
      if (expectation === "always") {
        if (!nextCharIsSpace || isWhitespace(source[index + 2])) {
          report({
            message: messages.expectedOpening,
            node: node,
            result,
            ruleName,
          })
        }
      } else if (expectation === "never") {
        if (nextCharIsSpace) {
          report({
            message: messages.rejectedOpening,
            node: node,
            result,
            ruleName,
          })
        }
      }
    }

    function checkClosing(source, index, node) {
      const prevCharIsSpace = source[index - 1] === " "
      if (expectation === "always") {
        if (!prevCharIsSpace || isWhitespace(source[index - 2])) {
          report({
            message: messages.expectedClosing,
            node: node,
            result,
            ruleName,
          })
        }
      } else if (expectation === "never") {
        if (prevCharIsSpace) {
          report({
            message: messages.rejectedClosing,
            node: node,
            result,
            ruleName,
          })
        }
      }
    }
  }
}
