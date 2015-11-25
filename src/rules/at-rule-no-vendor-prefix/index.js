import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "at-rule-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed at-rule "@${p}"`,
})

export default function (actual) {
  return function (root, result) {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      const { name } = atRule

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
