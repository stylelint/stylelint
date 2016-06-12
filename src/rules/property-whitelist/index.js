import { vendor } from "postcss"
import { isString } from "lodash"
import {
  isCustomProperty,
  isStandardSyntaxProperty,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (property) => `Unexpected property "${property}"`,
})

export default function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {

      const { prop } = decl
      if (!isStandardSyntaxProperty(prop)) { return }
      if (isCustomProperty(prop)) { return }
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
