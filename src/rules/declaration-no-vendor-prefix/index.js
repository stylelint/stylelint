import {
  ruleMessages,
  isAutoprefixable
} from "../../utils"

export const ruleName = "declaration-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor prefix "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      checkIdent(decl.prop, decl)
      checkIdent(decl.value, decl)
    })

    function checkIdent(ident, node) {
      // Make sure there's a vendor prefix,
      // but this isn't a custom property
      if (ident[0] !== "-" && ident[1] !== "-") { return }

      if (isAutoprefixable(ident)) {
        result.warn(messages.rejected(ident), { node })
      }
    }
  }
}
