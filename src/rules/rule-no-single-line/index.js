import {
  isSingleLineString,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "rule-no-single-line"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected single-line rule`,
})

export default function () {
  return (root, result) => {
    root.eachRule(rule => {

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
