import {
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "rule-no-single-line"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected single-line rule`,
})

export default function (o) {
  return (root, result) => {
    validateOptions({ ruleName, result, actual: o })

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
