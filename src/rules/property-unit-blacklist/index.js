import { vendor } from "postcss"
import { isObject, find } from "lodash"
import valueParser from "postcss-value-parser"

import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "property-unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected unit "${u}" for property "${p}"`,
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
        if (node.type === "string") { return }

        const unit = valueParser.unit(node.value).unit

        if (propBlacklist.indexOf(unit) !== -1) {
          report({
            message: messages.rejected(prop, unit),
            node: decl,
            index: declarationValueIndexOffset(decl) + node.sourceIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
