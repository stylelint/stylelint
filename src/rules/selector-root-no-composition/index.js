import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "selector-root-no-composition"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected composition of the ":root" selector`,
})

export default function () {
  return function (css, result) {
    css.eachRule(function (rule) {
      if (rule.selector.indexOf(":root") === -1) { return }

      if (rule.selector.trim() === ":root") { return }

      report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
