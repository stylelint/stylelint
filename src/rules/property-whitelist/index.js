import { isString } from "lodash"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

const RE_VALID_CSS_PROPERTY = /^[a-z-]+$/

export const ruleName = "property-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected property "${p}"`,
})

export default function (whitelistInput) {
  const whitelist = [].concat(whitelistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      const prop = decl.prop

      if (!RE_VALID_CSS_PROPERTY.test(prop)) { return }

      if (whitelist.indexOf(vendor.unprefixed(prop)) === -1) {
        report({
          message: messages.rejected(prop),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
