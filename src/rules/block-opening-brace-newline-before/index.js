import {
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  cssStatementIsNestingBlock,
  cssStatementStringBeforeBlock,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "{"`,
  expectedBeforeSingleLine: () => `Expected newline before "{" of a single-line block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line block`,
  expectedBeforeMultiLine: () => `Expected newline before "{" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line block`,
})

export default function (expectation) {
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
    })
    if (!validOptions) { return }

    // Check both kinds of statement: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement) || cssStatementIsNestingBlock(statement)) { return }

      const beforeBrace = cssStatementStringBeforeBlock(statement)

      // The string to check for multi-line vs single-line is the block:
      // the curly braces and everything between them
      const lineCheckStr = statement.toString().slice(beforeBrace.length)

      checker.beforeAllowingIndentation({
        lineCheckStr,
        source: beforeBrace,
        index: beforeBrace.length,
        err: m => {
          report({
            message: m,
            node: statement,
            index: cssStatementStringBeforeBlock(statement, { noBefore: true }).length - 1,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
