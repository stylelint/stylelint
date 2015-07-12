import {
  cssStatementBlockString,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ";"`,
  expectedAfterMultiLine: () => `Expected newline after ";" in a multi-line rule`,
  rejectedAfterMultiLine: () => `Unexpected newline after ";" in a multi-line rule`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    root.eachDecl(decl => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const nextNode = decl.next()
      if (!nextNode) { return }

      // Allow end-of-line comments one space after the semicolon
      let nodeToCheck = (nextNode.type === "comment" && nextNode.before === " ")
        ? nextNode.next()
        : nextNode
      if (!nodeToCheck) { return }

      check.afterOneOnly({
        source: nodeToCheck.toString(),
        index: -1,
        lineCheckStr: cssStatementBlockString(parentRule),
        err: m => {
          return report({
            message: m,
            node: decl,
            result,
            ruleName,
          })
        },
      })
    })
  }
}
