import {
  ruleMessages,
  whitespaceChecker,
  styleSearch
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
      styleSearch({ source: selector, target: "," }, function (index) {
        checkDelimiter(selector, index, rule)
      })
    })

    function checkDelimiter(source, index, node) {
      checkLocation(source, index, m => result.warn(m, { node }))
    }
  }
}
