import selectorParser from "postcss-selector-parser"
import { isRegExp, isString } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-class-pattern"

export const messages = ruleMessages(ruleName, {
  expected: selectorValue => `Expected class selector ".${selectorValue}" to match specified pattern`,
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
      selectorParser(checkSelector).process(rule.selector)

      function checkSelector(fullSelector) {
        fullSelector.eachInside(selectorNode => {
          if (selectorNode.type !== "class") { return }
          const { value, sourceIndex } = selectorNode

          if (!normalizedPattern.test(value)) {
            report({
              result,
              ruleName,
              message: messages.expected(value),
              node: rule,
              index: sourceIndex,
            })
          }
        })
      }
    })
  }
}
