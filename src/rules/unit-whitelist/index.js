import {
  atRuleParamIndex,
  declarationValueIndex,
  getUnitFromValueNode,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import valueParser from "postcss-value-parser"

export const ruleName = "unit-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (unit) => `Unexpected unit "${unit}"`,
})

function rule(whitelistInput) {
  const whitelist = [].concat(whitelistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [isString],
    })
    if (!validOptions) { return }

    function check(node, value, getIndex) {
      valueParser(value).walk(function (valueNode) {
        // Ignore wrong units within `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") { return false }

        const unit = getUnitFromValueNode(valueNode)

        if (!unit || (unit && whitelist.indexOf(unit.toLowerCase()) !== -1)) { return }

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

rule.primaryOptionArray = true

export default rule
