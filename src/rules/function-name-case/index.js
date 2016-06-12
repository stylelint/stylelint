import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  isStandardSyntaxFunction,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { camelCaseFunctionNames } from "../../reference/keywordSets"

export const ruleName = "function-name-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

const mapLowercaseFunctionNamesToCamelCase = new Map()
camelCaseFunctionNames.forEach(func => {
  mapLowercaseFunctionNamesToCamelCase.set(func.toLowerCase(), func)
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
        if (node.type !== "function" || !isStandardSyntaxFunction(node)) { return }

        const functionName = node.value
        const functionNameLowerCase = functionName.toLowerCase()

        let expectedFunctionName = null

        if (expectation === "lower"
          && mapLowercaseFunctionNamesToCamelCase.has(functionNameLowerCase)
        ) {
          expectedFunctionName = mapLowercaseFunctionNamesToCamelCase.get(functionNameLowerCase)
        } else if (expectation === "lower") {
          expectedFunctionName = functionNameLowerCase
        } else {
          expectedFunctionName = functionName.toUpperCase()
        }

        if (functionName === expectedFunctionName) { return }

        report({
          message: messages.expected(functionName, expectedFunctionName),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
