import { vendor } from "postcss"
import { isString } from "lodash"
import {
  isStandardDeclaration,
  matchesStringOrRegExp,
  propertyIsCustom,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected property "${p}"`,
})

export default function (blacklistInput) {
  const blacklist = [].concat(blacklistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (!isStandardDeclaration(decl)) { return }

      const { prop } = decl
      if (propertyIsCustom(prop)) { return }
      if (!matchesStringOrRegExp(vendor.unprefixed(prop), blacklist)) { return }

      report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
