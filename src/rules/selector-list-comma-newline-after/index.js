import {
  ruleMessages,
  styleSearch,
  report,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  expectedAfterMultiLine: () => `Expected newline after "," in a multi-line list`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "," in a multi-line list`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    root.eachRule(rule => {
      const selector = rule.selector
      styleSearch({ source: selector, target: "," }, match => {
        checker.afterOneOnly({
          source: selector,
          index: match.startIndex,
          err: m =>
            report({
              message: m,
              node: rule,
              result,
              ruleName,
            }),
        })
      })
    })
  }
}
