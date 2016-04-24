import { vendor } from "postcss"
import { isString } from "lodash"
import {
  isStandardDeclaration,
  propertyIsCustom,
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

      if (!isStandardDeclaration(decl)) { return }

      const { prop } = decl
      if (propertyIsCustom(prop)) { return }

      if (matchesStringOrRegExp(vendor.unprefixed(prop), whitelist)) { return }

      report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
