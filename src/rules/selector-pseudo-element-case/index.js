import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { levelOneAndTwoPseudoElements } from "../../reference/keywordSets"

export const ruleName = "selector-pseudo-element-case"

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

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const selector = rule.selector
      const startIndexPseudoElement = selector.indexOf(":")

      if (startIndexPseudoElement === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const pseudoElement = pseudoNode.value

          if (!isStandardSyntaxSelector(pseudoElement)) { return }

          if (pseudoElement.indexOf("::") === -1
            && !levelOneAndTwoPseudoElements.has(pseudoElement.toLowerCase().slice(1))
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
      })
    })
  }
}
