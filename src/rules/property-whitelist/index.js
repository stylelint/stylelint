import { vendor } from "postcss"
import { isString } from "lodash"
import {
  cssPropertyIsVariable,
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

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

      if (cssPropertyIsVariable(prop)) { return }

      if (!matchesStringOrRegExp(vendor.unprefixed(prop), whitelist)) {
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
