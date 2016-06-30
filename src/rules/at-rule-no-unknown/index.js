import { isString } from "lodash"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { atRules } from "../../reference/keywordSets"

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
      const nameAtRule = atRule.name

      if (vendor.prefix(nameAtRule) || atRules.has(nameAtRule.toLowerCase())) { return }

      const ignoredAtRules = options && options.ignoreAtRules || []

      if (ignoredAtRules.indexOf(nameAtRule.toLowerCase()) !== -1) { return }

      report({
        message: messages.rejected(`@${nameAtRule}`),
        node: atRule,
        ruleName,
        result,
      })
    })
  }
}
