import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  cssStatementStringBeforeBlock,
  rawNodeString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-opening-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \"{\"",
  expectedAfterMultiLine: () => "Expected newline after \"{\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \"{\" of a multi-line block",
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

    // Check both kinds of statement: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {

      // Return early if blockless or has an empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      // Allow an end-of-line comment x spaces after the brace
      const firstNode = statement.first
      const firstNodeIsAcceptableComment = (
        firstNode.type === "comment"
        && !/[^ ]/.test(firstNode.raw("before"))
        && firstNode.toString().indexOf("\n") === -1
      )
      const nodeToCheck = (firstNodeIsAcceptableComment)
        ? firstNode.next()
        : firstNode
      if (!nodeToCheck) { return }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        lineCheckStr: cssStatementBlockString(statement),
        err: m => {
          report({
            message: m,
            node: statement,
            index: cssStatementStringBeforeBlock(statement, { noBefore: true }).length + 1,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
