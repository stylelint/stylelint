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

const ignoredCamelCaseFunctionNames = {
  "translatex": "translateX",
  "translatey": "translateY",
  "translatez": "translateZ",
  "scalex": "scaleX",
  "scaley": "scaleY",
  "scalez": "scaleZ",
  "rotatex": "rotateX",
  "rotatey": "rotateY",
  "rotatez": "rotateZ",
  "skewx": "skewX",
  "skewy": "skewY",
}

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
        const functionNameLowerCase = functionName.toLocaleLowerCase()

        let expectedFunctionName = null

        if (expectation === "lower"
          && ignoredCamelCaseFunctionNames.hasOwnProperty(functionNameLowerCase)
        ) {
          expectedFunctionName = ignoredCamelCaseFunctionNames[functionNameLowerCase]
        } else if (expectation === "lower") {
          expectedFunctionName = functionNameLowerCase
        } else {
          expectedFunctionName = functionName.toUpperCase()
        }

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
