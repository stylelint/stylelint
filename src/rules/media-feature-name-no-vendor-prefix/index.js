import {
  isAutoprefixable,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "media-feature-name-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected vendor-prefixed media feature name",
})

export default function () {
  return (css, result) => {
    css.eachAtRule(atRule => {
      const { params } = atRule
      if (isAutoprefixable.mediaFeatureName(params)) {
        report({
          message: messages.rejected,
          node: atRule,
          result,
          ruleName,
        })
      }
    })
  }
}
