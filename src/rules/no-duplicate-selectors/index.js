import {
  findAtRuleContext,
  isKeyframeRule,
  nodeContextLookup,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  includes,
  union,
} from "lodash"
import normalizeSelector from "normalize-selector"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

export const ruleName = "no-duplicate-selectors"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected duplicate selector "${selector}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    // The top level of this map will be rule sources.
    // Each source maps to another map, which maps rule parents to a set of selectors.
    // This ensures that selectors are only checked against selectors
    // from other rules that share the same parent and the same source.
    const selectorContextLookup = nodeContextLookup()

    root.walkRules(rule => {

      if (isKeyframeRule(rule)) { return }

      const contextSelectorSet = selectorContextLookup.getContext(rule, findAtRuleContext(rule))
      const resolvedSelectors = rule.selectors.reduce((result, selector) => {
        return union(result, resolvedNestedSelector(selector, rule))
      }, [])
      const normalizedSelectorList = resolvedSelectors.map(normalizeSelector)

      // Complain if the same selector list occurs twice

      // Sort the selectors list so that the order of the constituents
      // doesn't matter
      const sortedSelectorList = normalizedSelectorList.slice().sort().join(",")
      if (contextSelectorSet.has(sortedSelectorList)) {
        // If the selector isn't nested we can use its raw value; otherwise,
        // we have to approximate something for the message -- which is close enough
        const isNestedSelector = resolvedSelectors.join(",") !== rule.selectors.join(",")
        const selectorForMessage = (isNestedSelector) ? resolvedSelectors.join(", ") : rule.selector
        return report({
          result,
          ruleName,
          node: rule,
          message: messages.rejected(selectorForMessage),
        })
      }

      // We're treating the Map created by nodeContextLookup as a Set
      contextSelectorSet.set(sortedSelectorList, null)

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
