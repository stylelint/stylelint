import {
  ruleMessages,
  styleSearch,
  isWhitespace
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
          result.warn(messages.expectedBefore(), { node: atRule })
        }
        if (expectation === "never" && isWhitespace(params[match.startIndex - 1])) {
          result.warn(messages.rejectedBefore(), { node: atRule })
        }
      })
    })
  }
}
