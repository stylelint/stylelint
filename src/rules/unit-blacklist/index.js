import { isString } from "lodash"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (unit) => `Unexpected unit "${unit}"`,
})

export default function (blacklistInput) {
  const blacklist = [].concat(blacklistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(node)

        if (!unit || (unit && blacklist.indexOf(unit.toLowerCase()) === -1)) { return }

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
