import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  isStandardSyntaxValue,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { colorFunctionNames } from "../../reference/keywordSets"
import namedColorData from "../../reference/namedColorData"

export const ruleName = "color-named"

export const messages = ruleMessages(ruleName, {
  expected: (named, original) => (
    `Expected "${original}" to be "${named}"`
  ),
  rejected: (named) => (
    `Unexpected named color "${named}"`
  ),
})

// Todo tested on case insensivity
const NODE_TYPES = [ "word", "function" ]

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "never",
        "always-where-possible",
      ],
    })
    if (!validOptions) { return }

    const namedColors = Object.keys(namedColorData)

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        const { value, type, sourceIndex } = node

        if (!isStandardSyntaxValue(value)) { return }
        // Return early if neither a word nor a function
        if (NODE_TYPES.indexOf(type) === -1) { return }

        // Check for named colors for "never" option
        if (
          expectation === "never"
          && type === "word"
          && namedColors.indexOf(value.toLowerCase()) !== -1
        ) {
          complain(
            messages.rejected(value),
            decl,
            declarationValueIndex(decl) + sourceIndex
          )
          return
        }

        // Check "always-where-possible" option ...
        if (expectation !== "always-where-possible") { return }

        // First by checking for alternative color function representations ...
        if (
          type === "function"
          && colorFunctionNames.has(value.toLowerCase())
        ) {
          // Remove all spaces to match what's in `representations`
          const normalizedFunctionString = valueParser.stringify(node).replace(/\s+/g, "")
          let namedColor
          for (let i = 0, l = namedColors.length; i < l; i++) {
            namedColor = namedColors[i]
            if (namedColorData[namedColor].func.indexOf(normalizedFunctionString.toLowerCase()) !== -1) {
              complain(
                messages.expected(namedColor, normalizedFunctionString),
                decl,
                declarationValueIndex(decl) + sourceIndex
              )
              return // Exit as soon as a problem is found
            }
          }
          return
        }

        // Then by checking for alternative hex representations
        let namedColor
        for (let i = 0, l = namedColors.length; i < l; i++) {
          namedColor = namedColors[i]
          if (namedColorData[namedColor].hex.indexOf(value.toLowerCase()) !== -1) {
            complain(
              messages.expected(namedColor, value),
              decl,
              declarationValueIndex(decl) + sourceIndex
            )
            return // Exit as soon as a problem is found
          }
        }
      })
    })

    function complain(message, node, index) {
      report({
        result,
        ruleName,
        message,
        node,
        index,
      })
    }
  }
}
