import valueParser from "postcss-value-parser"
import {
  cssWordIsVariable,
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "value-keyword-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

// Operators are interpreted as "words" by the value parser, so we want to make sure to ignore them.
const ignoredCharacters = new Set([
  "+", "-", "/", "*", "%",
])

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
        // Ignore keywords within `url` function
        if (node.type === "function" && node.value === "url") { return false }

        const keyword = node.value

        // Ignore css variables, and hex values, and math operators, and sass interpolation
        if (node.type !== "word"
          || cssWordIsVariable(node.value)
          || value.indexOf("#") !== -1
          || ignoredCharacters.has(keyword)
          || keyword === "currentColor"
        ) { return }

        const parsedUnit = valueParser.unit(keyword)

        if (parsedUnit !== false) { return }

        const expectedKeyword = expectation === "lower" ? keyword.toLowerCase() : keyword.toUpperCase()

        if (keyword === expectedKeyword) { return }

        report({
          message: messages.expected(keyword, expectedKeyword),
          node: decl,
          index: declarationValueIndexOffset(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
