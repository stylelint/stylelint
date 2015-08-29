import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions
} from "../../utils"

export const ruleName = "selector-no-attribute"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected attribute selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      styleSearch({ source: rule.selector, target: ["["] }, match => {
        report({
          message: messages.rejected,
          node: rule,
          index: match.startIndex,
          ruleName,
          result,
        })
      })
    })
  }
}
