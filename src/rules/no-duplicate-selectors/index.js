import {
  ruleMessages,
  report,
  validateOptions,
} from "../../utils"

export const ruleName = "no-duplicate-selectors"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected duplicate selector "${selector}"`,
})

// The top level of this map will be rule sources.
// Each source maps to another map, which maps rule parents to a set of selectors.
// This ensures that selectors are only checked against selectors
// from other rules that share the same parent and the same source.
var selectorContextMap = new Map()

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const ruleSource = rule.source.input.from
      const ruleParent = rule.parent
      if (!selectorContextMap.has(ruleSource)) {
        selectorContextMap.set(ruleSource, new Map())
      }
      if (!selectorContextMap.get(ruleSource).has(ruleParent)) {
        selectorContextMap.get(ruleSource).set(ruleParent, new Set())
      }
      const parentSelectorSet = selectorContextMap.get(ruleSource).get(ruleParent)

      for (let selector of rule.selectors) {
        if (parentSelectorSet.has(selector)) {
          return report({
            result,
            ruleName,
            message: messages.rejected(selector),
            node: rule,
            // This means that the first occurence of the violator will be flagged,
            // which is fine (given `a, a {}`, the first `a` selector is flagged)
            index: rule.toString().indexOf(selector),
          })
        }
        parentSelectorSet.add(selector)
      }
    })
  }
}
