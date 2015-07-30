import { vendor } from "postcss"
import { isString } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "property-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected property "${p}"`,
})

export default function (blacklist) {
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: blacklist,
      possible: [isString],
    })

    root.eachDecl(decl => {

      const prop = decl.prop

      if (blacklist.indexOf(vendor.unprefixed(prop)) !== -1) {
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
