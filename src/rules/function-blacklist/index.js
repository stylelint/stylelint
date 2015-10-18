import { isString } from "lodash"
import { vendor } from "postcss"
import valueParser from "postcss-value-parser"

import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p) => `Unexpected function "${p}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const {value} = decl
      valueParser(value).walk(function (node) {

        console.log(node)

        if (node.type === "function" && blacklist.indexOf(vendor.unprefixed(node.value)) !== -1) {
          report({
            message: messages.rejected(node.value),
            node: value,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
