import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "media-feature-name-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected vendor-prefix",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules(/^media$/i, atRule => {
      const { params } = atRule
      if (!isAutoprefixable.mediaFeatureName(params)) { return }
      const matches = atRule.toString().match(/[a-z-]+device-pixel-ratio/ig)
      matches.forEach(match => {
        report({
          message: messages.rejected,
          node: atRule,
          word: match,
          result,
          ruleName,
        })
      })
    })
  }
}
