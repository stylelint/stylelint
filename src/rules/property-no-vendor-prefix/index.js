import {
  ruleMessages,
  isAutoprefixable
} from "../../utils"

export const ruleName = "property-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed property "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const prop = decl.prop

      // Make sure there's a vendor prefix,
      // but this isn't a custom property
      if (prop[0] !== "-" || prop[1] === "-") { return }

      if (isAutoprefixable(prop)) {
        result.warn(messages.rejected(prop), { node: decl })
      }
    })
  }
}
