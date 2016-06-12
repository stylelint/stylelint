import {
  isCustomProperty,
  isStandardSyntaxProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-case"

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

    root.walkDecls(decl => {
      const { prop } = decl
      if (!isStandardSyntaxProperty(prop)) { return }
      if (isCustomProperty(prop)) { return }

      const expectedProp = expectation === "lower" ? prop.toLowerCase() : prop.toUpperCase()
      if (prop === expectedProp) { return }

      report({
        message: messages.expected(prop, expectedProp),
        node: decl,
        ruleName,
        result,
      })
    })
  }
}
