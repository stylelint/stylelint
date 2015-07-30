import { isString } from "lodash"
import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "property-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected property "${p}"`,
})

export default function (whitelist) {
  return (root, result) => {
    validateOptions({ ruleName, result,
      actual: whitelist,
      possible: [isString],
    })

    root.eachDecl(decl => {

      const prop = decl.prop

      if (whitelist.indexOf(vendor.unprefixed(prop)) === -1) {
        report({
          message: messages.rejected(prop),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
