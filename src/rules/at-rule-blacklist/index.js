import { report, ruleMessages, validateOptions } from "../../utils"
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "at-rule-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected at-rule "${name}"`,
})

function rule(blacklistInput) {
  // To allow for just a string as a parameter (not only arrays of strings)
  const blacklist = [].concat(blacklistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) {
      return
    }

    root.walkAtRules(atRule => {
      const name = atRule.name

      if (blacklist.indexOf(vendor.unprefixed(name).toLowerCase()) === -1) {
        return
      }

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
