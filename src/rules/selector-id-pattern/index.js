import { isRegExp, isString } from "lodash"
import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-id-pattern"

export const messages = ruleMessages(ruleName, {
  expected: selectorValue => `Expected id selector "#${selectorValue}" to match specified pattern`,
})

export default function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) { return }

    const normalizedPattern = isString(pattern) ? new RegExp(pattern) : pattern

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }

      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }

      parseSelector(selector, result, rule, fullSelector => {
        fullSelector.walk(selectorNode => {
          if (selectorNode.type !== "id") { return }
          const { value, sourceIndex } = selectorNode

          if (normalizedPattern.test(value)) { return }

          report({
            result,
            ruleName,
            message: messages.expected(value),
            node: rule,
            index: sourceIndex,
          })
        })
      })
    })
  }
}
