import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions
} from "../../utils"

export const ruleName = "media-query-parentheses-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: `Expected single space after "("`,
  rejectedOpening: `Unexpected whitespace after "("`,
  expectedClosing: `Expected single space before ")"`,
  rejectedClosing: `Unexpected whitespace before ")"`,
})

export default function (expectation) {
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })

    root.eachAtRule(atRule => {
      if (atRule.name !== "media") { return }

      const params = atRule.params

      styleSearch({ source: params, target: "(" }, match => {
        const nextCharIsSpace = params[match.startIndex + 1] === " "
        if (nextCharIsSpace && expectation === "never") {
          report({
            message: messages.rejectedOpening,
            node: atRule,
            result,
            ruleName,
          })
        }
        if (!nextCharIsSpace && expectation === "always") {
          report({
            message: messages.expectedOpening,
            node: atRule,
            result,
            ruleName,
          })
        }
      })

      styleSearch({ source: params, target: ")" }, match => {
        const prevCharIsSpace = params[match.startIndex - 1] === " "
        if (prevCharIsSpace && expectation === "never") {
          report({
            message: messages.rejectedClosing,
            node: atRule,
            result,
            ruleName,
          })
        }
        if (!prevCharIsSpace && expectation === "always") {
          report({
            message: messages.expectedClosing,
            node: atRule,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
