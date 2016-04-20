import _ from "lodash"
import selectorParser from "postcss-selector-parser"
import {
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
      selectorParser(selectorTree => {
        selectorTree.eachPseudo(pseudoNode => {
          if (_.get(pseudoNode, "parent.parent.type") === "pseudo") { return }

          const pseudoSelectorString = pseudoNode.toString()

          styleSearch({ source: pseudoSelectorString, target: "(" }, match => {
            const nextCharIsSpace = pseudoSelectorString[match.startIndex + 1] === " "
            if (nextCharIsSpace && expectation === "never") {
              report({
                message: messages.rejectedOpening,
                node: rule,
                index: pseudoNode.sourceIndex + match.startIndex + 1,
                result,
                ruleName,
              })
            }
            if (!nextCharIsSpace && expectation === "always") {
              report({
                message: messages.expectedOpening,
                node: rule,
                index: pseudoNode.sourceIndex + match.startIndex + 1,
                result,
                ruleName,
              })
            }
          })

          styleSearch({ source: pseudoSelectorString, target: ")" }, match => {
            const prevCharIsSpace = pseudoSelectorString[match.startIndex - 1] === " "
            if (prevCharIsSpace && expectation === "never") {
              report({
                message: messages.rejectedClosing,
                node: rule,
                index: pseudoNode.sourceIndex + match.startIndex - 1,
                result,
                ruleName,
              })
            }
            if (!prevCharIsSpace && expectation === "always") {
              report({
                message: messages.expectedClosing,
                node: rule,
                index: pseudoNode.sourceIndex + match.startIndex - 1,
                result,
                ruleName,
              })
            }
          })
        })
      }).process(rule.selector)
    })
  }
}
