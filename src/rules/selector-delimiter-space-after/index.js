import {
  report,
  ruleMessages,
  styleSearch,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-delimiter-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after selector delimiter",
  rejectedAfter: () => "Unexpected space after selector delimiter",
})
/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return selectorDelimiterSpaceChecker(checker.after)
}

export function selectorDelimiterSpaceChecker(checkLocation) {
  return function (css, result) {
    css.eachRule(function (rule) {
      const selector = rule.selector
      styleSearch({ source: selector, target: "," }, match => {
        checkDelimiter(selector, match.startIndex, rule)
      })
    })

    function checkDelimiter(source, index, node) {
      checkLocation(source, index, m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        })
      )
    }
  }
}
