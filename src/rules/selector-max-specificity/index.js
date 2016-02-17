// Bring in dependencies
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
      possible: [function (max) {
        // Check that the pattern matches
        var pattern = new RegExp("^[0-9]+\,[0-9]+\,[0-9]+$")
        return pattern.test(max)
      }],
    })
    if (!validOptions) { return }

    root.walkRules(checkSpecificity)

    function checkSpecificity(rule) {
      // using rule.selectors gets us each selector in the eventuality we have a comma separated set
      rule.selectors.forEach(function (selector) {
        // calculate() returns a four section string — we only need 3 so strip the first two characters:
        const computedSpecificity = calculate(selector)[0].specificity.substring(2)
        // Check if the selector specificity exceeds the allowed maximum
        if (parseFloat(computedSpecificity.replace(/,/g, "")) > parseFloat(max.replace(/,/g, ""))) {
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
