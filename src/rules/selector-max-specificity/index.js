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
        var pattern = new RegExp("^\\d+,\\d+,\\d+$")
        return pattern.test(max)
      }],
    })
    if (!validOptions) { return }

    root.walkRules(checkSpecificity)

    function checkSpecificity(rule) {
      // using rule.selectors gets us each selector in the eventuality we have a comma separated set
      rule.selectors.forEach(selector => {
        resolveNestedSelector(selector, rule).forEach(resolvedSelector => {
          // calculate() returns a four section string — we only need 3 so strip the first two characters:
          const computedSpecificity = calculate(resolvedSelector)[0].specificity.substring(2)
          // Check if the selector specificity exceeds the allowed maximum
          if (parseFloat(computedSpecificity.replace(/,/g, "")) > parseFloat(max.replace(/,/g, ""))) {
            report({
              ruleName: ruleName,
              result: result,
              node: rule,
              message: messages.expected(resolvedSelector, max),
              word: selector,
            })
            return
          }
        })
      })
    }
  }
}

function resolveNestedSelector(selector, node) {
  const { parent } = node
  if (parent.type === "root") return [selector]
  if (parent.type !== "rule") return resolveNestedSelector(selector, parent)

  const resolvedSelectors = parent.selectors.reduce((result, parentSelector) => {
    if (selector.indexOf("&") !== -1) {
      const newlyResolvedSelectors = resolveNestedSelector(parentSelector, parent).map(resolvedParentSelector => {
        return selector.replace("&", resolvedParentSelector)
      })
      return result.concat(newlyResolvedSelectors)
    }

    const combinedSelector = [ parentSelector, selector ].join(" ")
    return result.concat(resolveNestedSelector(combinedSelector, parent))
  }, [])

  return resolvedSelectors
}
