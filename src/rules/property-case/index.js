import {
  isStandardDeclaration,
  propertyIsCustom,
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
      if (!isStandardDeclaration(decl)) { return }

      const { prop } = decl
      if (propertyIsCustom(prop)) { return }

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
