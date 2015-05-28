import {
  ruleMessages,
  isWhitespace,
  styleSearch
} from "../../utils"

export const ruleName = "function-token-no-space"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected space between function name and \"(\"",
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: "(" }, index => {
        checkOpeningParen(value, index, decl)
      })
    })

    function checkOpeningParen(source, index, node) {
      if (isWhitespace(source[index - 1])) {
        result.warn(messages.rejected, { node })
      }
    }
  }
}
