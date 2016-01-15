import {
  report,
  ruleMessages,
  styleSearch,
  isAutoprefixable,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed selector "${p}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const selector = rule.selector

      // Check each pseudo-selector
      styleSearch({ source: selector, target: ":" }, match => {
        const pseudoSelector = /:{1,2}[a-z-]+\b/.exec(selector.slice(match.startIndex))
        if (pseudoSelector === null) { return }
        if (isAutoprefixable.selector(pseudoSelector[0])) {
          report({
            message: messages.rejected(pseudoSelector[0]),
            node: rule,
            index: match.startIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
