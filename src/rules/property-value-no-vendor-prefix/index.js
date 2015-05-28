import {
  ruleMessages,
  isAutoprefixable
} from "../../utils"

export const ruleName = "property-value-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed property value "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      // Make sure there's a vendor prefix
      if (value[0] !== "-") { return }

      value.split(/[ \(]/).forEach(valuePart => {
        if (isAutoprefixable(valuePart)) {
          result.warn(messages.rejected(valuePart), { node: decl })
        }
      })
    })
  }
}
