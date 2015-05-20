import {
  ruleMessages,
  isWhitespace
} from "../../utils"

export const ruleName = "function-token-no-space"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected space between function name and \"(\"",
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      if (decl.prop === "content") { return }

      const value = decl.value

      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i] === "(") {
          checkOpening(value, i, decl)
        }
      }
    })

    function checkOpening(source, index, node) {
      if (isWhitespace(source[index - 1])) {
        result.warn(messages.rejected, { node })
      }
    }
  }
}
