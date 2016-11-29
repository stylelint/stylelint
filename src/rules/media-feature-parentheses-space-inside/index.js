import { atRuleParamIndex, report, ruleMessages, validateOptions } from "../../utils"
import _ from "lodash"
import styleSearch from "style-search"

export const ruleName = "media-feature-parentheses-space-inside"

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
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    root.walkAtRules(/^media$/i, atRule => {
      // If there are comments in the params, the complete string
      // will be at atRule.raws.params.raw
      const params = _.get(atRule, "raws.params.raw", atRule.params)
      const indexBoost = atRuleParamIndex(atRule)

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
