import { vendor } from "postcss"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "property-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected property "${p}"`,
})

export default function (whitelist) {
  return (root, result) => {

    root.eachDecl(decl => {

      const prop = decl.prop

      if (whitelist.indexOf(vendor.unprefixed(prop)) === -1) {
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
