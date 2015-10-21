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
  rejected: (name) => `Unexpected function "${name}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }
    root.walkDecls(decl => {
      const { value } = decl
      valueParser(value).walk(function (node) {
        if (node.type === "function" && blacklist.indexOf(vendor.unprefixed(node.value)) !== -1) {
          const charsBeforeColon = decl.toString().indexOf(":")
          const charsAfterColon = decl.raw("between").length - decl.raw("between").indexOf(":")
          report({
            message: messages.rejected(node.value),
            node: decl,
            index: charsBeforeColon + charsAfterColon + node.sourceIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
