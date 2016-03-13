import valueParser from "postcss-value-parser"

import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import representations from "./representations"

export const ruleName = "color-named"

export const messages = ruleMessages(ruleName, {
  expected: (named, original) => (
    `Expected "${original}" to be "${named}"`
  ),
  rejected: (named) => (
    `Unexpected named color "${named}"`
  ),
})

const FUNC_REPRESENTATION = [ "rgb", "rgba", "hsl", "hsla", "hwb", "gray" ]
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

    const namedColors = Object.keys(representations)

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        const { value, type, sourceIndex } = node

        // Return early if neither a word nor a function
        if (NODE_TYPES.indexOf(type) === -1) { return }

        // Check for named colors for "never" option
        if (
          expectation === "never" &&
          type === "word" &&
          namedColors.indexOf(value) !== -1
        ) {
          complain(
            messages.rejected(value),
            decl,
            declarationValueIndexOffset(decl) + sourceIndex
          )
        }
        // Check "always-where-possible" option
        if (expectation === "always-where-possible") {
          // First by checking for alternative color function representations
          if (
            type === "function" &&
            FUNC_REPRESENTATION.indexOf(value) !== -1
          ) {
            const cssString = valueParser.stringify(node).replace(/\s+/g, "")
            namedColors.forEach(namedColor => {
              if (representations[namedColor].func.indexOf(cssString) !== -1) {
                complain(
                  messages.expected(namedColor, cssString),
                  decl,
                  declarationValueIndexOffset(decl) + sourceIndex
                )
              }
            })
          // Then by checking for alternative hex representations
          } else {
            namedColors.forEach(namedColor => {
              if (representations[namedColor].hex.indexOf(value) !== -1) {
                complain(
                  messages.expected(namedColor, value),
                  decl,
                  declarationValueIndexOffset(decl) + sourceIndex
                )
              }
            })
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
