import valueParser from "postcss-value-parser"
// import _ from "lodash"
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

const FUNC_REPRESENTATIONS = [ "rgb", "rgba", "hsl", "hsla", "hwb", "gray" ]
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
          expectation === "never"
          && type === "word"
          && namedColors.indexOf(value) !== -1
        ) {
          complain(
            messages.rejected(value),
            decl,
            declarationValueIndexOffset(decl) + sourceIndex
          )
          return
        }

        // Check "always-where-possible" option ...
        if (expectation !== "always-where-possible") { return }

        // First by checking for alternative color function representations ...
        if (
          type === "function"
          && FUNC_REPRESENTATIONS.indexOf(value) !== -1
        ) {
          // Remove all spaces to match what's in `representations`
          const normalizedFunctionString = valueParser.stringify(node).replace(/\s+/g, "")
          let namedColor
          for (let i = 0, l = namedColors.length; i < l; i++) {
            namedColor = namedColors[i]
            if (representations[namedColor].func.indexOf(normalizedFunctionString) !== -1) {
              complain(
                messages.expected(namedColor, normalizedFunctionString),
                decl,
                declarationValueIndexOffset(decl) + sourceIndex
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
          if (representations[namedColor].hex.indexOf(value) !== -1) {
            complain(
              messages.expected(namedColor, value),
              decl,
              declarationValueIndexOffset(decl) + sourceIndex
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
