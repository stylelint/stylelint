import { isObject } from "lodash"
import valueParser from "postcss-value-parser"

import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (p, u) => `Unexpected unit "${u}" for property "${p}"`,
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
      const blacklistInProp = blacklist[prop]

      valueParser(value).walk(function (node) {
        const unit = valueParser.unit(node.value).unit

        if (blacklistInProp && blacklistInProp.indexOf(unit) !== -1 && node.type !== "string") {
          report({
            message: messages.rejected(prop, unit),
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
