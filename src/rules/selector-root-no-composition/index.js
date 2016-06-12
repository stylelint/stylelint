import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-root-no-composition"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected composition",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (rule.selector.toLowerCase().indexOf(":root") === -1
      || rule.selector.toLowerCase().trim() === ":root") {
        return
      }

      report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
