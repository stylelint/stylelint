import { vendor } from "postcss"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "property-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected blacklisted property "${p}"`,
})

export default function (blacklist) {
  return (css, result) => {

    css.eachDecl(decl => {

      const prop = decl.prop

      if (blacklist.indexOf(vendor.unprefixed(prop)) !== -1) {
        report({
          message: messages.rejected(prop),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
