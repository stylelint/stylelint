import {
  find,
  isEmpty,
  isObject,
} from "lodash"
import {
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { vendor } from "postcss"

export const ruleName = "declaration-property-value-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
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

      if (!matchesStringOrRegExp(value, propBlacklist)) { return }

      report({
        message: messages.rejected(prop, value),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
