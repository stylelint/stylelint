import {
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

      styleSearch({ source: params, target: "(" }, index => {
        const nextCharIsSpace = params[index + 1] === " "
        if (nextCharIsSpace && expectation === "never") {
          result.warn(messages.rejectedOpening, { node: atRule })
        }
        if (!nextCharIsSpace && expectation === "always") {
          result.warn(messages.expectedOpening, { node: atRule })
        }
      })

      styleSearch({ source: params, target: ")" }, index => {
        const prevCharIsSpace = params[index - 1] === " "
        if (prevCharIsSpace && expectation === "never") {
          result.warn(messages.rejectedClosing, { node: atRule })
        }
        if (!prevCharIsSpace && expectation === "always") {
          result.warn(messages.expectedClosing, { node: atRule })
        }
      })
    })
  }
}
