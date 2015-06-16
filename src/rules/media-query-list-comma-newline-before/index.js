import {
  isWhitespace,
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "media-query-list-comma-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ","`,
  rejectedBefore: () => `Unexpected space before ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachAtRule(atRule => {
      const params = atRule.params
      styleSearch({ source: params, target: "," }, match => {
        const paramsBeforeComma = params.substr(0, match.startIndex)

        // Check for a newline anywhere before the comma, while allowing
        // arbitrary indentation between the newline and the comma
        if (expectation === "always" && !/[^\s]\n[ \t]*$/.test(paramsBeforeComma)) {
          report({
            message: messages.expectedBefore(),
            node: atRule,
            result,
            ruleName,
          })
        }
        if (expectation === "never" && isWhitespace(params[match.startIndex - 1])) {
          report({
            message: messages.rejectedBefore(),
            node: atRule,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
