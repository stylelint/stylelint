import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  expectedAfterMultiLine: () => `Expected newline after "," in a multi-line list`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "," in a multi-line list`,
})

export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
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
