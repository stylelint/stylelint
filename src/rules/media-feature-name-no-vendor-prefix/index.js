import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "media-feature-name-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected vendor-prefixed media feature name",
})

export default function (o) {
  return (root, result) => {
    validateOptions({ result, ruleName, actual: o })

    root.eachAtRule(atRule => {
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
