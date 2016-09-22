import {
  blockString,
  hasBlock,
  optionsMatches,
  rawNodeString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { isString } from "lodash"

export const ruleName = "block-closing-brace-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \"}\"",
  expectedAfterSingleLine: () => "Expected newline after \"}\" of a single-line block",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \"}\" of a single-line block",
  expectedAfterMultiLine: () => "Expected newline after \"}\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \"}\" of a multi-line block",
})

export default function (expectation, options) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    }, {
      actual: options,
      possible: {
        ignoreAtRules: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      if (!hasBlock(statement)) { return }
      if (optionsMatches(options, "ignoreAtRules", statement.name)) { return }

      const nextNode = statement.next()
      if (!nextNode) { return }

      // Allow an end-of-line comment x spaces after the brace
      const nextNodeIsSingleLineComment = (
        nextNode.type === "comment"
        && !/[^ ]/.test(nextNode.raw("before"))
        && nextNode.toString().indexOf("\n") === -1
      )

      const nodeToCheck = (nextNodeIsSingleLineComment) ? nextNode.next() : nextNode
      if (!nodeToCheck) { return }

      let reportIndex = statement.toString().length
      let source = rawNodeString(nodeToCheck)

      // Skip a semicolon at the beginning, if any
      if (source && source[0] === ";") {
        source = source.slice(1)
        reportIndex++
      }

      // Only check one after, because there might be other
      // spaces handled by the indentation rule
      checker.afterOneOnly({
        source,
        index: -1,
        lineCheckStr: blockString(statement),
        err: msg => {
          report({
            message: msg,
            node: statement,
            index: reportIndex,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
