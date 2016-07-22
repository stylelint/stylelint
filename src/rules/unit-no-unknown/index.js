import {
  atRuleParamIndex,
  declarationValueIndex,
  getUnitFromValueNode,
  optionsHaveIgnoredUnit,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import { units } from "../../reference/keywordSets"
import valueParser from "postcss-value-parser"

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

    function check(node, value, getIndex) {
      valueParser(value).walk(function (valueNode) {
        // Ignore wrong units within `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(valueNode)
        if (!unit) { return }

        if (optionsHaveIgnoredUnit(options, unit)) { return }

        if (units.has(unit.toLowerCase())) { return }

        report({
          index: getIndex(node) + valueNode.sourceIndex,
          message: messages.rejected(unit),
          node,
          result,
          ruleName,
        })
      })
    }

    root.walkAtRules(/^media$/i, atRule =>
      check(atRule, atRule.params, atRuleParamIndex)
    )
    root.walkDecls(decl =>
      check(decl, decl.value, declarationValueIndex)
    )
  }
}
