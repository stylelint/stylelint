import resolvedNestedSelector from "postcss-resolve-nested-selector"
import selectorParser from "postcss-selector-parser"

import {
  isStandardRule,
  isStandardSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-max-depth"

export const messages = ruleMessages(ruleName, {
  expected: (selector, depth) => `Expected "${selector}" to have a depth equal to or less than ${depth}`,
})

export default function (max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: [function (max) {
        return typeof max === "number" && max > 0
      }],
    })
    if (!validOptions) { return }

    // Finds actual selectors in selectorNode object and checks them
    function checkSelector(selectorNode, rule) {
      let compoundCount = 1
      
      selectorNode.each(childNode => {
        // Only traverse inside actual selectors and :not()
        if (childNode.type === "selector" || childNode.value === ":not") {
          checkSelector(childNode, rule)
        }

        // Compund selectors are separated by combinators, so increase count when meeting one
        if (childNode.type === "combinator") { compoundCount ++ }
      })

      if (selectorNode.type !== "root" && selectorNode.type !== "pseudo" && compoundCount > max) {
        report({
          ruleName,
          result,
          node: rule,
          message: messages.expected(selectorNode, max),
          word: selectorNode,
        })
      }
    }

    root.walkRules(rule => {
      // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing the intermediate parts of selectors (to process only fully resolved selectors)
      if (rule.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }
      // Skip custom rules, Less selectors, etc.
      if (!isStandardRule(rule)) { return }
      // Skip selectors with interpolation
      if (!isStandardSelector(rule.selector)) { return }

      // Using `rule.selectors` gets us each selector if there is a comma separated set
      rule.selectors.forEach((selector) => {
        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          // Process each resolved selector with `checkSelector` via postcss-selector-parser
          selectorParser(s => checkSelector(s, rule)).process(resolvedSelector)
        })
      })
    })
  }
}
