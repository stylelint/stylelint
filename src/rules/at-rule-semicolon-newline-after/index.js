import {
  hasBlock,
  nextNonCommentNode,
  rawNodeString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "at-rule-semicolon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \";\"",
})

export default function (actual) {
  const checker = whitespaceChecker("newline", actual, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual,
      possible: ["always"],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {

      const nextNode = atRule.next()
      if (!nextNode) { return }
      if (hasBlock(atRule)) { return }

      // Allow an end-of-line comment
      const nodeToCheck = nextNonCommentNode(nextNode)
      if (!nodeToCheck) { return }

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
