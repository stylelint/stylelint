import { vendor } from "postcss"
import { isObject } from "lodash"

import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-value-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected value "${u}" for property "${p}"`,
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
      const propBlacklist = blacklist[vendor.unprefixed(prop)]

      const isMatching = propBlacklist.some(blacklistedProp => {

        const isRegex = blacklistedProp[0] === "/" &&
                        blacklistedProp[blacklistedProp.length - 1] === "/"

        return isRegex
          ? value.match(blacklistedProp.slice(1, -1))
          : blacklistedProp === value
      })

      if (isMatching) {
        report({
          message: messages.rejected(prop, value),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
