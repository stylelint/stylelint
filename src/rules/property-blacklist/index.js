import {
  isCustomProperty,
  isStandardSyntaxProperty,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "property-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (property) => `Unexpected property "${property}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { prop } = decl
      if (!isStandardSyntaxProperty(prop)) { return }
      if (isCustomProperty(prop)) { return }
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

rule.primaryOptionArray = true

export default rule
