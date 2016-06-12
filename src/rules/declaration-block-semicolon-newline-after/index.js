import {
  blockString,
  report,
  nextNonCommentNode,
  rawNodeString,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-block-semicolon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \";\"",
  expectedAfterMultiLine: () => "Expected newline after \";\" in a multi-line declaration block",
  rejectedAfterMultiLine: () => "Unexpected newline after \";\" in a multi-line declaration block",
})

export default function (expectation) {

  const checker = whitespaceChecker("newline", expectation, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.raw("semicolon") && parentRule.last === decl) { return }

      const nextNode = decl.next()
      if (!nextNode) { return }

      // Allow end-of-line comment
      const nodeToCheck = nextNonCommentNode(nextNode)
      if (!nodeToCheck) { return }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        lineCheckStr: blockString(parentRule),
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.toString().length + 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}
