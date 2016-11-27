const declarationValueIndex = require("../../utils/declarationValueIndex")
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { find, isObject } from "lodash"
const valueParser = require("postcss-value-parser")
import { vendor } from "postcss"

export const ruleName = "declaration-property-unit-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
})

module.exports = function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isObject],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop,
        value = decl.value

      const unprefixedProp = vendor.unprefixed(prop)

      const propWhitelist = find(whitelist, (list, propIdentifier) => matchesStringOrRegExp(unprefixedProp, propIdentifier))

      if (!propWhitelist) {
        return
      }

      valueParser(value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") {
          return false
        }
        if (node.type === "string") {
          return
        }

        const unit = getUnitFromValueNode(node)

        if (!unit || (unit && propWhitelist.indexOf(unit.toLowerCase())) !== -1) {
          return
        }

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
