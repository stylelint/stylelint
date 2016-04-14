import valueParser from "postcss-value-parser"
import {
  cssWordIsVariable,
  declarationValueIndexOffset,
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
      const { value } = decl

      valueParser(value).walk((node) => {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value === "url") { return false }
        if (node.type !== "word" || cssWordIsVariable(node.value)) { return }

        const parsedUnit = valueParser.unit(node.value)

        if (!parsedUnit) { return }

        const unit = parsedUnit.unit

        if (!unit) { return }

        const expectedUnit = expectation === "lower" ? unit.toLowerCase() : unit.toUpperCase()

        if (unit === expectedUnit) { return }

        report({
          message: messages.expected(unit, expectedUnit),
          node: decl,
          index: declarationValueIndexOffset(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
