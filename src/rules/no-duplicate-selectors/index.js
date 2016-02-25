import { includes } from "lodash"
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

      const normalizedSelectorList = rule.selectors.map(normalizeSelector)

      // Complain if the same selector list occurs twice

      // Sort the selectors list so that the order of the constituents
      // doesn't matter
      const sortedSelectorList = normalizedSelectorList.slice().sort().join(",")
      if (parentSelectorSet.has(sortedSelectorList)) {
        return report({
          result,
          ruleName,
          node: rule,
          message: messages.rejected(rule.selector),
        })
      }

      parentSelectorSet.add(sortedSelectorList)

      // Or complain if one selector list contains the same selector more than one

      rule.selectors.forEach((selector, i) => {
        if (includes(normalizedSelectorList.slice(0, i), normalizeSelector(selector))) {
          report({
            result,
            ruleName,
            node: rule,
            message: messages.rejected(selector),
          })
        }
      })
    })
  }
}

function normalizeSelector(selector) {
  return selector.replace(/\s/g, "")
}
