import { calculate } from "specificity"
import _ from "lodash"
import selectorParser from "postcss-selector-parser"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

import {
  cssNodeContextLookup,
  findMediaContext,
  isLowerSpecificity,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-descending-specificity"

export const messages = ruleMessages(ruleName, {
  rejected: (a, b) => `Expected selector "${b}" to come before selector "${a}"`,
})

const selectorContextLookup = cssNodeContextLookup()

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const comparisonContext = selectorContextLookup.getContext(rule, findMediaContext(rule))

      rule.selectors.forEach(selector => {
        // The edge-case of duplicate selectors will act acceptably
        const index = rule.selector.indexOf(selector.trim())
        // Resolve any nested selectors before checking
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          selectorParser(s => checkSelector(s, rule, index, comparisonContext)).process(resolvedSelector)
        })
      })
    })

    function checkSelector(selectorNode, rule, sourceIndex, comparisonContext) {
      const selector = selectorNode.toString()
      const lastCompoundSelector = _.last(selectorNode.nodes.toString())
      const selectorSpecificity = calculate(selector)[0].specificity.split(",")
      const entry = { selector, specificity: selectorSpecificity }

      if (!comparisonContext.has(lastCompoundSelector)) {
        comparisonContext.set(lastCompoundSelector, [entry])
        return
      }

      const priorComparableSelectors = comparisonContext.get(lastCompoundSelector)

      priorComparableSelectors.forEach(priorEntry => {
        if (isLowerSpecificity(selectorSpecificity, priorEntry.specificity)) {
          report({
            ruleName,
            result,
            node: rule,
            message: messages.rejected(selector, priorEntry.selector),
            index: sourceIndex,
          })
        }
      })

      priorComparableSelectors.push(entry)
    }
  }
}
