import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-closing-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"}\"",
  rejectedBefore: () => "Unexpected whitespace before \"}\"",
  expectedBeforeSingleLine: () => "Expected single space before \"}\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \"}\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected single space before \"}\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected whitespace before \"}\" of a multi-line block",
})

export default function (expectation) {

  const checker = whitespaceChecker("space", expectation, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
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
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      const source = cssStatementBlockString(statement)

      checker.before({
        source,
        index: source.length - 1,
        err: msg => {
          report({
            message: msg,
            node: statement,
            index: statement.toString().length - 2,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
