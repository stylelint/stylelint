import { vendor } from "postcss"
import { isObject, find } from "lodash"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  getUnitFromValueNode,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (property, unit) => `Unexpected unit "${unit}" for property "${property}"`,
})

function rule(blacklist) {
  return (root, result) => {

    result.warn((
      "'property-unit-blacklist' has been deprecated, "
        + "and will be removed in '7.0'. Use 'declaration-property-unit-blacklist' instead."
    ), {
      stylelintType: "deprecation",
      stylelintReference: "http://stylelint.io/user-guide/rules/declaration-property-unit-blacklist/",
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

rule.primaryOptionArray = true

export default rule
