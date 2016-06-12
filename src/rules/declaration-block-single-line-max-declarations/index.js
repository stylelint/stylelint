import { isNumber } from "lodash"
import {
  blockString,
  beforeBlockString,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-block-single-line-max-declarations"

export const messages = ruleMessages(ruleName, {
  expected: (quantity) => `Expected no more than ${quantity} declaration(s)`,
})

export default function (quantity) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: quantity,
      possible: [isNumber],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isSingleLineString(blockString(rule))) { return }
      if (!rule.nodes) { return }

      const decls = rule.nodes.filter(node => node.type === "decl")

      if (decls.length <= quantity) { return }

      report({
        message: messages.expected(quantity),
        node: rule,
        index: beforeBlockString(rule, { noRawBefore: true }).length,
        result,
        ruleName,
      })
    })
  }
}
