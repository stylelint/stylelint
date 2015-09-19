import {
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-no-single-line"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected single-line rule`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isSingleLineString(rule.toString())) { return }

      report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
