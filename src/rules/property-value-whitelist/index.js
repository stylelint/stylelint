import { vendor } from "postcss"
import { isObject, isEmpty, find } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "property-value-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected value "${u}" for property "${p}"`,
})

export default function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isObject],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      const { prop, value } = decl
      const unprefixedProp = vendor.unprefixed(prop)
      const propWhitelist = find(whitelist, (list, propIdentifier) => matchesStringOrRegExp(unprefixedProp, propIdentifier))

      if (isEmpty(propWhitelist)) { return }

      if (matchesStringOrRegExp(value, propWhitelist)) { return }

      report({
        message: messages.rejected(prop, value),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
