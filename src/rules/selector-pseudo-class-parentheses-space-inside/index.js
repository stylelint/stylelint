import _ from "lodash"
import {
  isStandardSyntaxRule,
  parseSelector,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-class-parentheses-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected single space after \"(\"",
  rejectedOpening: "Unexpected whitespace after \"(\"",
  expectedClosing: "Expected single space before \")\"",
  rejectedClosing: "Unexpected whitespace before \")\"",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      if (rule.selector.indexOf("(") === -1) { return }

      parseSelector(rule.selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          if (_.get(pseudoNode, "parent.parent.type") === "pseudo") { return }

          const pseudoSelectorString = pseudoNode.toString()

          styleSearch({ source: pseudoSelectorString, target: "(" }, match => {
            const nextCharIsSpace = pseudoSelectorString[match.startIndex + 1] === " "
            const index = pseudoNode.sourceIndex + match.startIndex + 1
            if (nextCharIsSpace && expectation === "never") {
              complain(messages.rejectedOpening, index)
            }
            if (!nextCharIsSpace && expectation === "always") {
              complain(messages.expectedOpening, index)
            }
          })

          styleSearch({ source: pseudoSelectorString, target: ")" }, match => {
            const prevCharIsSpace = pseudoSelectorString[match.startIndex - 1] === " "
            const index = pseudoNode.sourceIndex + match.startIndex - 1
            if (prevCharIsSpace && expectation === "never") {
              complain(messages.rejectedClosing, index)
            }
            if (!prevCharIsSpace && expectation === "always") {
              complain(messages.expectedClosing, index)
            }
          })
        })
      })

      function complain(message, index) {
        report({
          message,
          index,
          result,
          ruleName,
          node: rule,
        })
      }
    })
  }
}
