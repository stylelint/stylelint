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
  rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
})

export default function (blacklist) {
  return (root, result) => {

    result.warn((
      "'property-value-blacklist' has been deprecated, "
        + "and will be removed in '7.0'. Use 'declaration-property-value-blacklist' instead."
    ), {
      stylelintType: "deprecation",
      stylelintReference: "http://stylelint.io/user-guide/rules/declaration-property-value-blacklist/",
    })

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
