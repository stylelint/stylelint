import { vendor } from "postcss"
import { isObject, isEmpty, find } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "property-value-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected value "${u}" for property "${p}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isObject],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      const { prop, value } = decl
      const unprefixedProp = vendor.unprefixed(prop)
      const propBlacklist = find(blacklist, (list, propIdentifier) => matchesStringOrRegExp(unprefixedProp, propIdentifier))

      if (isEmpty(propBlacklist)) { return }

      if (matchesStringOrRegExp(value, propBlacklist)) {
        report({
          message: messages.rejected(prop, value),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
