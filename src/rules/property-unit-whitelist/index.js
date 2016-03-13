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

export const ruleName = "property-unit-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected unit "${u}" for property "${p}"`,
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

      if (!propWhitelist) { return }

      valueParser(value).walk(function (node) {
        if (node.type === "string") { return }

        const unit = valueParser.unit(node.value).unit

        if (unit && propWhitelist.indexOf(unit) === -1) {
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
