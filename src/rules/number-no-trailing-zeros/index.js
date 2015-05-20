import {
  ruleMessages
} from "../../utils"

export const ruleName = "number-no-trailing-zeros"
export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected trailing zero(s)",
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) { return }

      if (/\.\d*0+(?:\D|$)/g.test(value)) {
        result.warn(messages.rejected, { node: decl })
      }
    })
  }
}

