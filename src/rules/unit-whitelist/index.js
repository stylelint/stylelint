import { isString } from "lodash"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (unit) => `Unexpected unit "${unit}"`,
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
      valueParser(decl.value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(node)

        if (!unit || (unit && whitelist.indexOf(unit.toLowerCase()) !== -1)) { return }

        report({
          message: messages.rejected(unit),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
