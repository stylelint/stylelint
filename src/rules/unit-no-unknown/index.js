import { isString } from "lodash"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { units } from "../../reference/keywordSets"

export const ruleName = "unit-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (unit) => `Unexpected unknown unit "${unit}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreUnits: [isString],
      },
      optional: true,
    })

    if (!validOptions) { return }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(function (node) {
        // Ignore wrong units within `url` function
        if (node.type === "function" && node.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(node)

        if (!unit || (unit && units.has(unit.toLowerCase()))) { return }

        const ignoreUnits = options && options.ignoreUnits || []

        if (ignoreUnits.indexOf(unit.toLowerCase()) !== -1) { return }

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
