import {
  report,
  ruleMessages,
  styleSearch,
  whitespaceChecker
} from "../../utils"

export const ruleName = "media-query-list-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ","`,
  rejectedAfter: () => `Unexpected space after ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return mediaQueryListCommaChecker(checker.after)
}

export function mediaQueryListCommaChecker(checkLocation) {
  return function (root, result) {
    root.eachAtRule(function (atRule) {
      const params = atRule.params
      styleSearch({ source: params, target: "," }, match => {
        checkComma(params, match.startIndex, atRule)
      })
    })

    function checkComma(source, index, node) {
      checkLocation(source, index, m =>
        report({
          message: m,
          node,
          result,
          ruleName,
        })
      )
    }
  }
}
