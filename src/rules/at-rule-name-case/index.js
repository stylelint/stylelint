import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "at-rule-name-case"

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

    root.walkAtRules(atRule => {
      const { name } = atRule
      const expectedName = expectation === "lower" ? name.toLowerCase() : name.toUpperCase()

      if (name === expectedName) { return }

      report({
        message: messages.expected(name, expectedName),
        node: atRule,
        ruleName,
        result,
      })
    })
  }
}
