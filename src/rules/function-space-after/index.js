import {
  ruleMessages,
  isWhitespace
} from "../../utils"

export const ruleName = "function-space-after"

export const messages = ruleMessages(ruleName, {
  expected: "Expected single space after function's \")\"",
  rejected: "Unexpected space after function's \")\"",
})

const acceptableNextChars = [ " ", ")", undefined ]

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      if (decl.prop === "content") { return }

      const value = decl.value

      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i] === ")") {
          checkEnd(value, i, decl)
        }
      }
    })

    function checkEnd(str, i, node) {
      // Allow for the function's ending being the end of the value
      if (expectation === "always") {
        if (acceptableNextChars.indexOf(str[i + 1]) === -1 || isWhitespace(str[i + 2])) {
          result.warn(messages.expected, { node })
        }
      } else if (expectation === "never") {
        if (isWhitespace(str[i + 1])) {
          result.warn(messages.rejected, { node })
        }
      }
    }
  }
}
