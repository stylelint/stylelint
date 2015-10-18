import { isNumber } from "lodash"
import {
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-no-single-line"

export const messages = ruleMessages(ruleName, {
  expected: (quantity) => `Expected a maximum of ${quantity} declaration(s)`,
})

export default function (quantity) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: quantity,
      possible: [isNumber],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isSingleLineString(rule.toString())) { return }

      const decls = rule.nodes.filter(node => node.type === "decl")
      
      if (decls.length <= quantity) { return }

      report({
        message: messages.expected(quantity),
        node: rule,
        result,
        ruleName,
      })
    })
  }
}
