import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "at-rule-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (name) => `Unexpected at-rule "${name}"`,
})

function rule(whitelistInput) {
  // To allow for just a string as a parameter (not only arrays of strings)
  const whitelist = [].concat(whitelistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      const { name } = atRule
      if (whitelist.indexOf(vendor.unprefixed(name).toLowerCase()) !== -1) { return }

      report({
        message: messages.rejected(name),
        node: atRule,
        result,
        ruleName,
      })
    })
  }
}

rule.primaryOptionArray = true

export default rule
