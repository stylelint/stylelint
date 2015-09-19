import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "media-feature-name-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected vendor-prefixed media feature name",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      const { params } = atRule
      if (isAutoprefixable.mediaFeatureName(params)) {
        const matches = atRule.toString().match(/[a-z-]+device-pixel-ratio/g)
        matches.forEach(match => {
          report({
            message: messages.rejected,
            node: atRule,
            word: match,
            result,
            ruleName,
          })
        })
      }
    })
  }
}
