import {
  isKeyframeRule,
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  isStandardSyntaxTypeSelector,
  parseSelector,
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

      if (!isStandardSyntaxRule(rule)) { return }
      if (isKeyframeRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }

      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkTags(tag => {

          if (!isStandardSyntaxTypeSelector(tag)) { return }

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
      })
    })
  }
}
