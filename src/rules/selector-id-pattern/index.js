import selectorParser from "postcss-selector-parser"
import { isRegExp, isString } from "lodash"
import {
  isStandardRule,
  isStandardSelector,
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
      if (!isStandardRule(rule)) { return }

      const { selector } = rule
      if (!isStandardSelector(selector)) { return }

      selectorParser(checkSelector).process(selector)

      function checkSelector(fullSelector) {
        fullSelector.eachInside(selectorNode => {
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
      }
    })
  }
}
