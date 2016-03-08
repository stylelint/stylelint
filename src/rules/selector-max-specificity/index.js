import { calculate } from "specificity"
import resolvedNestedSelector from "postcss-resolve-nested-selector"

import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-max-specificity"

export const messages = ruleMessages(ruleName, {
  expected: (selector, specificity) => `Expected "${selector}" to have a specificity equal to or less than "${specificity}"`,
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

    root.walkRules(rule => {
      // Using rule.selectors gets us each selector in the eventuality we have a comma separated set
      rule.selectors.forEach(selector => {
        // Return early if there is interpolation in the selector
        if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(selector)) { return }

        resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
          // calculate() returns a four section string — we only need 3 so strip the first two characters
          const computedSpecificity = calculate(resolvedSelector)[0].specificity.substring(2)
          // Check if the selector specificity exceeds the allowed maximum
          if (parseFloat(computedSpecificity.replace(/,/g, "")) > parseFloat(max.replace(/,/g, ""))) {
            report({
              ruleName,
              result,
              node: rule,
              message: messages.expected(resolvedSelector, max),
              word: selector,
            })
          }
        })
      })
    })
  }
}
