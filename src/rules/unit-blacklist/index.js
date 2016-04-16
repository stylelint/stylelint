import { isString } from "lodash"
import valueParser from "postcss-value-parser"

import {
  cssWordIsVariable,
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "unit-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (u) => `Unexpected unit "${u}"`,
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
      const { value } = decl

      valueParser(value).walk(function (node) {
        if (node.type === "function" && node.value === "url") { return false }
        if (node.type !== "word" || cssWordIsVariable(node.value)) { return }

        const parsedUnit = valueParser.unit(node.value)

        if (!parsedUnit) { return }

        const unit = parsedUnit.unit

        if (!unit || blacklist.indexOf(unit) === -1) { return }

        report({
          message: messages.rejected(unit),
          node: decl,
          index: declarationValueIndexOffset(decl) + node.sourceIndex,
          result,
          ruleName,
        })
      })
    })
  }
}
