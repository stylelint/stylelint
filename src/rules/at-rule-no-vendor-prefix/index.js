import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "at-rule-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed at-rule "@${p}"`,
})

export default function (o) {
  return function (root, result) {
    const validOptions = validateOptions(result, ruleName, {
      actual: o,
      possible: [],
    })
    if (!validOptions) { return }

    root.eachAtRule(function (atRule) {
      const name = atRule.name

      if (name[0] !== "-") { return }

      if (isAutoprefixable.atRuleName(name)) {
        report({
          message: messages.rejected(name),
          node: atRule,
          result,
          ruleName,
        })
      }
    })
  }
}
