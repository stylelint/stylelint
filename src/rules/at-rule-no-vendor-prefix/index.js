import {
  ruleMessages,
  vendorPrefixSets,
  stripVendorPrefix
} from "../../utils"

export const ruleName = "at-rule-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor prefix "@${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachAtRule(function (atRule) {
      const name = atRule.name

      if (name[0] !== "-") { return }

      if (vendorPrefixSets.atRules.has(stripVendorPrefix(name))) {
        result.warn(messages.rejected(name), { node: atRule })
      }
    })
  }
}
