import {
  declarationValueIndex,
  getUnitFromValueNode,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  find,
  isObject,
} from "lodash"
import valueParser from "postcss-value-parser"
import { vendor } from "postcss"

export const ruleName = "declaration-property-unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
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

      if (!propBlacklist) { return }

      valueParser(value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") { return false }
        if (node.type === "string") { return }

        const unit = getUnitFromValueNode(node)

        if (!unit || (unit && propBlacklist.indexOf(unit.toLowerCase()) === -1)) { return }

        report({
          message: messages.rejected(prop, unit),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
