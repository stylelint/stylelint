import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-element-case"

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
      const startIndexPseudoElement = selector.indexOf(":")

      if (startIndexPseudoElement === -1) { return }

      selectorParser(selectorTree => {
        selectorTree.eachPseudo(pseudoNode => {
          const pseudoElement = pseudoNode.value

          if (pseudoElement.indexOf("::") === -1
            && !pseudoElements.has(pseudoElement.toLowerCase())
          ) {
            return
          }

          const expectedPseudoElement = expectation === "lower"
            ? pseudoElement.toLowerCase()
            : pseudoElement.toUpperCase()

          if (pseudoElement === expectedPseudoElement) { return }

          report({
            message: messages.expected(pseudoElement, expectedPseudoElement),
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
