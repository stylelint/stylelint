import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "selector-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \",\"",
  expectedAfterMultiLine: () => "Expected newline after \",\" in a multi-line list",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \",\" in a multi-line list",
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
      // Get raw selector so we can allow end-of-line comments, e.g.
      // a, /* comment */
      // b {}
      const selector = (rule.raws.selector) ? rule.raws.selector.raw : rule.selector
      styleSearch({ source: selector, target: ",", outsideFunctionalNotation: true }, match => {
        const nextThreeChars = selector.substr(match.endIndex, 3)

        // If there's a // comment, that means there has to be a newline
        // ending the comment so we're fine
        if (nextThreeChars === " //") { return }

        // If there is a space and then a comment begins, look for the newline
        // after that comment
        const indextoCheckAfter = (nextThreeChars === " /*")
          ? selector.indexOf("*/", match.endIndex) + 1
          : match.startIndex
        checker.afterOneOnly({
          source: selector,
          index: indextoCheckAfter,
          err: m =>
            report({
              message: m,
              node: rule,
              index: match.startIndex,
              result,
              ruleName,
            }),
        })
      })
    })
  }
}
