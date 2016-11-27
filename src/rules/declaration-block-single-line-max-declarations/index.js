const beforeBlockString = require("../../utils/beforeBlockString")
const blockString = require("../../utils/blockString")
const isSingleLineString = require("../../utils/isSingleLineString")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { isNumber } from "lodash"

export const ruleName = "declaration-block-single-line-max-declarations"

export const messages = ruleMessages(ruleName, {
  expected: quantity => `Expected no more than ${quantity} declaration(s)`,
})

module.exports = function (quantity) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: quantity,
      possible: [isNumber],
    })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isSingleLineString(blockString(rule))) {
        return
      }
      if (!rule.nodes) {
        return
      }

      const decls = rule.nodes.filter(node => node.type === "decl")

      if (decls.length <= quantity) {
        return
      }

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
