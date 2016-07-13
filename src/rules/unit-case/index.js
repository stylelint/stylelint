import {
  atRuleParamIndex,
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import valueParser from "postcss-value-parser"

export const ruleName = "unit-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    })
    if (!validOptions) { return }

    function check(node, value, getIndex) {
      valueParser(value).walk((valueNode) => {
        // Ignore wrong units within `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(valueNode)

        if (!unit) { return }

        const expectedUnit = expectation === "lower" ? unit.toLowerCase() : unit.toUpperCase()

        if (unit === expectedUnit) { return }

        report({
          index: getIndex(node) + valueNode.sourceIndex,
          message: messages.expected(unit, expectedUnit),
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
