import {
  calculate,
  compare,
} from "specificity"
import {
  findAtRuleContext,
  isCustomPropertySet,
  nodeContextLookup,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import _ from "lodash"
import { pseudoElements } from "../../reference/keywordSets"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

export const ruleName = "no-descending-specificity"

export const messages = ruleMessages(ruleName, {
  rejected: (b, a) => `Expected selector "${b}" to come before selector "${a}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const selectorContextLookup = nodeContextLookup()

    root.walkRules(rule => {
      // Ignore custom property set `--foo: {};`
      if (isCustomPropertySet(rule)) { return }

      const comparisonContext = selectorContextLookup.getContext(rule, findAtRuleContext(rule))

      rule.selectors.forEach(selector => {
        const trimSelector = selector.trim()
        // Ignore `.selector, { }`
        if (trimSelector === "") { return }

        // The edge-case of duplicate selectors will act acceptably
        const index = rule.selector.indexOf(trimSelector)
        // Resolve any nested selectors before checking
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          parseSelector(resolvedSelector, result, rule, s => checkSelector(s, rule, index, comparisonContext))
        })
      })
    })

    function checkSelector(selectorNode, rule, sourceIndex, comparisonContext) {
      const selector = selectorNode.toString()
      const referenceSelectorNode = lastCompoundSelectorWithoutPseudoClasses(selectorNode)
      const selectorSpecificity = calculate(selector)[0].specificityArray
      const entry = { selector, specificity: selectorSpecificity }

      if (!comparisonContext.has(referenceSelectorNode)) {
        comparisonContext.set(referenceSelectorNode, [entry])
        return
      }

      const priorComparableSelectors = comparisonContext.get(referenceSelectorNode)

      priorComparableSelectors.forEach(priorEntry => {
        if (compare(selectorSpecificity, priorEntry.specificity) === -1) {
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

function lastCompoundSelectorWithoutPseudoClasses(selectorNode) {
  const nodesAfterLastCombinator = _.last(selectorNode.nodes[0].split(node => {
    return node.type === "combinator"
  }))

  const nodesWithoutPseudoClasses = nodesAfterLastCombinator.filter(node => {
    return node.type !== "pseudo" || pseudoElements.has(node.value.replace(/:/g, ""))
  }).join("")

  return nodesWithoutPseudoClasses.toString()
}
