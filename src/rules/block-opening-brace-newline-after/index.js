import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "block-opening-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after "{"`,
  expectedAfterMultiLine: () => `Expected newline after "{" of a multi-line block`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "{" of a multi-line block`,
})

/**
 * @param {"always"|"always-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)

  return (root, result) => {

    // Check both kinds of statement: rules and at-rules
    root.eachRule(check)
    root.eachAtRule(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      // Allow an end-of-line comment one space after the brace
      const firstNode = statement.first
      const nodeToCheck = (firstNode.type === "comment" && firstNode.before === " ")
        ? firstNode.next()
        : firstNode
      if (!nodeToCheck) { return }

      checker.afterOneOnly({
        source: nodeToCheck.toString(),
        index: -1,
        lineCheckStr: cssStatementBlockString(statement),
        err: m => {
          report({
            message: m,
            node: nodeToCheck,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
