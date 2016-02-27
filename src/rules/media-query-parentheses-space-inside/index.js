import {
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "media-query-parentheses-space-inside"

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

    root.walkAtRules(atRule => {
      if (atRule.name !== "media") { return }

      const params = atRule.params
      const indexBoost = mediaQueryParamIndexOffset(atRule)

      styleSearch({ source: params, target: "(" }, match => {
        const nextCharIsSpace = params[match.startIndex + 1] === " "
        if (nextCharIsSpace && expectation === "never") {
          report({
            message: messages.rejectedOpening,
            node: atRule,
            index: match.startIndex + 1 + indexBoost,
            result,
            ruleName,
          })
        }
        if (!nextCharIsSpace && expectation === "always") {
          report({
            message: messages.expectedOpening,
            node: atRule,
            index: match.startIndex + 1 + indexBoost,
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
            index: match.startIndex - 1 + indexBoost,
            result,
            ruleName,
          })
        }
        if (!prevCharIsSpace && expectation === "always") {
          report({
            message: messages.expectedClosing,
            node: atRule,
            index: match.startIndex - 1 + indexBoost,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
