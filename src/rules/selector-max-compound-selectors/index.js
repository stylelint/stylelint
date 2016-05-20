import resolvedNestedSelector from "postcss-resolve-nested-selector"
import selectorParser from "postcss-selector-parser"

import {
  isStandardRule,
  isStandardSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-max-compound-selectors"

export const messages = ruleMessages(ruleName, {
  expected: (selector, max) => `Expected "${selector}" to have no more than ${max} compound selectors`,
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
    function checkSelector(selectorNode, statement) {

      let compoundCount = 1

      selectorNode.each(childNode => {
        // Only traverse inside actual selectors and :not()
        if (childNode.type === "selector" || childNode.value === ":not") {
          checkSelector(childNode, statement)

        }

        // Compund selectors are separated by combinators, so increase count when meeting one
        if (childNode.type === "combinator") { compoundCount++ }
      })

      if (selectorNode.type !== "root" && selectorNode.type !== "pseudo" && compoundCount > max) {
        report({
          ruleName,
          result,
          node: statement,
          message: messages.expected(selectorNode.toString().trim(), max),
          word: selectorNode,
        })
      }
    }

    function checkStatement(statement, selectors) {
      // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing the intermediate parts of selectors (to process only fully resolved selectors)
      if (statement.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }

      selectors.forEach((selector) => {
        resolvedNestedSelector(selector, statement).forEach(resolvedSelector => {
          // Process each resolved selector with `checkSelector` via postcss-selector-parser
          selectorParser(s => checkSelector(s, statement)).process(resolvedSelector)
        })
      })
    }

    root.walkRules(rule => {
      if (!isStandardRule(rule)) { return }
      if (!isStandardSelector(rule.selector)) { return }
      checkStatement(rule, rule.selectors)
    })

    root.walkAtRules(/^nest$/i, atRule => {
      checkStatement(atRule, atRule.params.split(","))
    })
  }
}
