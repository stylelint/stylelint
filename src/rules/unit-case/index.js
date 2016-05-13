import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-case"

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
      valueParser(decl.value).walk((node) => {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(node)

        if (!unit) { return }

        const expectedUnit = expectation === "lower" ? unit.toLowerCase() : unit.toUpperCase()

        if (unit === expectedUnit) { return }

        report({
          message: messages.expected(unit, expectedUnit),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
