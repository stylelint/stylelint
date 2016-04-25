import selectorParser from "postcss-selector-parser"
import {
  isKeyframeRule,
  isStandardRule,
  isStandardSelector,
  isStandardTypeSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-type-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isStandardRule(rule)) { return }
      if (isKeyframeRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSelector(selector)) { return }

      function checkSelector(selectorAST) {
        selectorAST.eachTag(tag => {

          if (!isStandardTypeSelector(tag)) { return }

          const { sourceIndex, value } = tag
          const expectedValue = expectation === "lower" ? value.toLowerCase() : value.toUpperCase()

          if (value === expectedValue) { return }

          report({
            message: messages.expected(value, expectedValue),
            node: rule,
            index: sourceIndex,
            ruleName,
            result,
          })
        })
      }

      selectorParser(checkSelector).process(selector)
    })
  }
}
