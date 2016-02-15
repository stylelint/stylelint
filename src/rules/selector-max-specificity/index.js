// Bring in dependencies
import { isNumber } from "lodash"
import { calculate }  from "specificity"
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
      possible: [isNumber],
    })

    if (!validOptions) { return }

    root.walkRules(checkSpecificity)

    function checkSpecificity(rule) {
      // using rule.selectors gets us each selector in the eventuality we have a comma separated set
      rule.selectors.forEach(function (selector) {
        let computedSpecificity = calculate(selector)[0].specificity.replace(/,/g, "")
        // Check if the selector specificity exceeds the allowed maximum
        if (computedSpecificity > max) {
          // Use report to output any messages
          report({ 
            ruleName: ruleName,
            result: result,
            node: rule,
            message: messages.expected(selector, max),
            word: selector,
          })
          return
        }
      })
    }
  }
}