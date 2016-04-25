import {
  blockString,
  hasBlock,
  hasEmptyBlock,
  beforeBlockString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-opening-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"{\"",
  rejectedAfter: () => "Unexpected whitespace after \"{\"",
  expectedAfterSingleLine: () => "Expected single space after \"{\" of a single-line block",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \"{\" of a single-line block",
  expectedAfterMultiLine: () => "Expected single space after \"{\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \"{\" of a multi-line block",
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

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      // Return early if blockless or has an empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      checker.after({
        source: blockString(statement),
        index: 0,
        err: m => {
          report({
            message: m,
            node: statement,
            index: beforeBlockString(statement, { noRawBefore: true }).length + 1,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
