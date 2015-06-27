import {
  isAutoprefixable,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "at-rule-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed at-rule "@${p}"`,
})

export default function () {
  return function (root, result) {
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
