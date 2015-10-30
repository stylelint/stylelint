import { isString } from "lodash"
import valueParser from "postcss-value-parser"

import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (u) => `Unexpected unit "${u}"`,
})

export default function (whitelistInput) {
  const whitelist = [].concat(whitelistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { value } = decl

      valueParser(value).walk(function (node) {
        const unit = valueParser.unit(node.value).unit

        if (unit && whitelist.indexOf(unit) === -1 && node.type !== "string") {
          report({
            message: messages.rejected(unit),
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
