import {
  ruleMessages,
  styleSearch,
  isAutoprefixable
} from "../../utils"

export const ruleName = "selector-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed selector "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachRule(function (rule) {
      const selector = rule.selector

      // Check each pseudo-selector
      styleSearch({ source: selector, target: ":" }, match => {
        const pseudoSelector = /:{1,2}[a-z-]+\b/.exec(selector.slice(match.startIndex))[0]
        if (isAutoprefixable.selector(pseudoSelector)) {
          result.warn(messages.rejected(pseudoSelector), { node: rule })
        }
      })
    })
  }
}
