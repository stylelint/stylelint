import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-class-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

// level 1 and 2 pseudo elements
const pseudoElements = new Set([
  ":before", ":after", ":first-line", ":first-letter",
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

    root.walkRules(rule => {
      const selector = rule.selector
      const startIndexPseudo = selector.indexOf(":")

      if (startIndexPseudo === -1) { return }

      selectorParser(selectorTree => {
        selectorTree.eachPseudo(pseudoNode => {
          const pseudo = pseudoNode.value

          if (pseudo.indexOf("::") !== -1
            || pseudoElements.has(pseudo.toLowerCase())
          ) {
            return
          }

          const expectedPseudo = expectation === "lower"
            ? pseudo.toLowerCase()
            : pseudo.toUpperCase()

          if (pseudo === expectedPseudo) { return }

          report({
            message: messages.expected(pseudo, expectedPseudo),
            node: rule,
            index: pseudoNode.sourceIndex,
            ruleName,
            result,
          })
        })
      }).process(selector)
    })
  }
}
