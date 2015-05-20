import {
  ruleMessages,
  isWhitespace
} from "../../utils"

export const ruleName = "function-parentheses-inside-space"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected single space before \"(\" of a function",
  rejectedOpening: "Unexpected space before \"(\" of a function",
  expectedClosing: "Expected single space before \")\" of a function",
  rejectedClosing: "Unexpected space before \")\" of a function",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      if (decl.prop === "content") { return }

      const value = decl.value

      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i] === "(") {
          checkOpening(value, i, decl)
        } else if (value[i] === ")") {
          checkClosing(value, i, decl)
        }
      }
    })

    function checkOpening(str, i, node) {
      const nextCharIsSpace = str[i + 1] === " "
      if (expectation === "always") {
        if (!nextCharIsSpace || isWhitespace(str[i + 2])) {
          result.warn(messages.expectedOpening, { node })
        }
      } else if (expectation === "never") {
        if (nextCharIsSpace) {
          result.warn(messages.rejectedOpening, { node })
        }
      }
    }

    function checkClosing(str, i, node) {
      const prevCharIsSpace = str[i - 1] === " "
      if (expectation === "always") {
        if (!prevCharIsSpace || isWhitespace(str[i - 2])) {
          result.warn(messages.expectedClosing, { node })
        }
      } else if (expectation === "never") {
        if (prevCharIsSpace) {
          result.warn(messages.rejectedClosing, { node })
        }
      }
    }
  }
}
