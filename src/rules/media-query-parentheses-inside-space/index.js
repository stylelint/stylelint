import {
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "media-query-parentheses-inside-space"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected single space before \"(\" of a function",
  rejectedOpening: "Unexpected space before \"(\" of a function",
  expectedClosing: "Expected single space before \")\" of a function",
  rejectedClosing: "Unexpected space before \")\" of a function",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return function (css, result) {
    css.eachAtRule(function (atRule) {
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
