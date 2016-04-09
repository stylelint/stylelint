import { calculate } from "specificity"
import _ from "lodash"
import selectorParser from "postcss-selector-parser"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

import {
  cssNodeContextLookup,
  findAtRuleContext,
  isLowerSpecificity,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-descending-specificity"

export const messages = ruleMessages(ruleName, {
  rejected: (a, b) => `Expected selector "${b}" to come before selector "${a}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const selectorContextLookup = cssNodeContextLookup()

    root.walkRules(rule => {
      const comparisonContext = selectorContextLookup.getContext(rule, findAtRuleContext(rule))

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
      const lastNonPseudoSelectorNode = lastCompoundSelectorWithoutPseudo(selectorNode)
      const selectorSpecificity = calculate(selector)[0].specificity.split(",")
      const entry = { selector, specificity: selectorSpecificity }

      if (!comparisonContext.has(lastNonPseudoSelectorNode)) {
        comparisonContext.set(lastNonPseudoSelectorNode, [entry])
        return
      }

      const priorComparableSelectors = comparisonContext.get(lastNonPseudoSelectorNode)

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

function lastCompoundSelectorWithoutPseudo(selectorNode) {
  const nodesAfterLastCombinator = _.last(selectorNode.nodes[0].split(node => {
    return node.type === "combinator"
  }))

  const nodesWithoutPseudos = nodesAfterLastCombinator.filter(node => {
    return node.type !== "pseudo"
  })

  return nodesWithoutPseudos.toString()
}
