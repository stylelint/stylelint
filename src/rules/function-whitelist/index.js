import { isString } from "lodash"
import { vendor } from "postcss"
import valueParser from "postcss-value-parser"

import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (name) => `Unexpected function "${name}"`,
})

export default function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possibleArray: [isString],
    })
    if (!validOptions) { return }
    root.walkDecls(decl => {
      const { value } = decl
      valueParser(value).walk(function (node) {
        if (node.type === "function" && whitelist.indexOf(vendor.unprefixed(node.value)) === -1) {
          report({
            message: messages.rejected(node.value),
            node: decl,
            index: declarationValueIndexOffset(decl) + node.sourceIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
