import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-attribute-brackets-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected single space after \"[\"",
  rejectedOpening: "Unexpected whitespace after \"[\"",
  expectedClosing: "Expected single space before \"]\"",
  rejectedClosing: "Unexpected whitespace before \"]\"",
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
      if (rule.selector.indexOf("[") === -1) { return }

      selectorParser(selectorTree => {
        selectorTree.eachAttribute(attributeNode => {
          const attributeSelectorString = attributeNode.toString()

          styleSearch({ source: attributeSelectorString, target: "[" }, match => {
            const nextCharIsSpace = attributeSelectorString[match.startIndex + 1] === " "
            const index = attributeNode.sourceIndex + match.startIndex + 1
            if (nextCharIsSpace && expectation === "never") {
              complain(messages.rejectedOpening, index)
            }
            if (!nextCharIsSpace && expectation === "always") {
              complain(messages.expectedOpening, index)
            }
          })

          styleSearch({ source: attributeSelectorString, target: "]" }, match => {
            const prevCharIsSpace = attributeSelectorString[match.startIndex - 1] === " "
            const index = attributeNode.sourceIndex + match.startIndex - 1
            if (prevCharIsSpace && expectation === "never") {
              complain(messages.rejectedClosing, index)
            }
            if (!prevCharIsSpace && expectation === "always") {
              complain(messages.expectedClosing, index)
            }
          })
        })
      }).process(rule.selector)

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
