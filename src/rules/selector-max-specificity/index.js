import { calculate } from "specificity"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

import {
  isStandardRule,
  isStandardSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-max-specificity"

export const messages = ruleMessages(ruleName, {
  expected: (selector, specificity) => `Expected "${selector}" to have a specificity no more than "${specificity}"`,
})

export default function (max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: [function (max) {
        // Check that the max specificity is in the form "a,b,c"
        const pattern = new RegExp("^\\d+,\\d+,\\d+$")
        return pattern.test(max)
      }],
    })
    if (!validOptions) { return }

    function checkStatement(statement, selectors) {
      // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing the intermediate parts of selectors (to process only fully resolved selectors)
      if (statement.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }

      selectors.forEach(selector => {
        resolvedNestedSelector(selector, statement).forEach(resolvedSelector => {
          // calculate() returns a four section string — we only need 3 so strip the first two characters
          const computedSpecificity = calculate(resolvedSelector)[0].specificity.substring(2)
          // Check if the selector specificity exceeds the allowed maximum
          if (normaliseSpecificity(computedSpecificity) > normaliseSpecificity(max)) {
            report({
              ruleName,
              result,
              node: statement,
              message: messages.expected(resolvedSelector.toString().trim(), max),
              word: selector,
            })
          }
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

function normaliseSpecificity(specificity) {
  return parseFloat(specificity.replace(/,/g, ""))
}
