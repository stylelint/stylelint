const hasBlock = require("../../utils/hasBlock")
const nextNonCommentNode = require("../../utils/nextNonCommentNode")
const rawNodeString = require("../../utils/rawNodeString")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")

export const ruleName = "at-rule-semicolon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \";\"",
})

module.exports = function (actual) {
  const checker = whitespaceChecker("newline", actual, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual,
      possible: ["always"],
    })
    if (!validOptions) {
      return
    }

    root.walkAtRules(atRule => {
      const nextNode = atRule.next()
      if (!nextNode) {
        return
      }
      if (hasBlock(atRule)) {
        return
      }

      // Allow an end-of-line comment
      const nodeToCheck = nextNonCommentNode(nextNode)
      if (!nodeToCheck) {
        return
      }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        err: msg => {
          report({
            message: msg,
            node: atRule,
            index: atRule.toString().length + 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}
