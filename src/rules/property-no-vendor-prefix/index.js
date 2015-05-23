import {
  ruleMessages,
  vendorPrefixSets,
  stripVendorPrefix
} from "../../utils"

export const ruleName = "property-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor prefix "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const prop = decl.prop

      if (prop[0] !== "-") { return }

      if (vendorPrefixSets.properties.has(stripVendorPrefix(prop))) {
        result.warn(messages.rejected(prop), { node: decl })
      }
    })
  }
}
