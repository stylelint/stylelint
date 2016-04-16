import valueParser from "postcss-value-parser"
import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-name-case"

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

      valueParser(value).walk(function (node) {
        if (node.type !== "function") { return }

        const functionName = node.value

        const expectedFunctionName = expectation === "lower"
          ? functionName.toLowerCase()
          : functionName.toUpperCase()

        if (functionName === expectedFunctionName) { return }

        report({
          message: messages.expected(functionName, expectedFunctionName),
          node: decl,
          index: declarationValueIndexOffset(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
