import {
  optionsHaveIgnoredAtRule,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { atRules } from "../../reference/keywordSets"
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "at-rule-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (atRule) => `Unexpected unknown at-rule "${atRule}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreAtRules: [isString],
      },
      optional: true,
    })

    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      const { name } = atRule

      // Return early if at-rule is to be ignored
      if (optionsHaveIgnoredAtRule(options, atRule)) { return }

      if (vendor.prefix(name) || atRules.has(name.toLowerCase())) { return }

      report({
        message: messages.rejected(`@${name}`),
        node: atRule,
        ruleName,
        result,
      })
    })
  }
}
