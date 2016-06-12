import { isString } from "lodash"
import { vendor } from "postcss"
import valueParser from "postcss-value-parser"

import {
  declarationValueIndex,
  isStandardSyntaxFunction,
  matchesStringOrRegExp,
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
        if (node.type !== "function") { return }
        if (!isStandardSyntaxFunction(node)) { return }
        if (!matchesStringOrRegExp(vendor.unprefixed(node.value).toLowerCase(), blacklist)) { return }

        report({
          message: messages.rejected(node.value),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })

      })
    })
  }
}
