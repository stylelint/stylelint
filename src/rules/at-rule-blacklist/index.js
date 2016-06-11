import { isString } from "lodash"
import { vendor } from "postcss"

import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "at-rule-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (name) => `Unexpected at-rule "${name}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      if (blacklist.indexOf(vendor.unprefixed(atRule.name).toLowerCase()) === -1) { return }

      report({
        message: messages.rejected(atRule.name),
        node: atRule,
        result,
        ruleName,
      })
    })
  }
}
