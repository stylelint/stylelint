import {
  blockString,
  hasBlock,
  hasEmptyBlock,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "block-closing-brace-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before closing brace",
  rejected: "Unexpected empty line before closing brace",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always-multi-line",
        "never",
      ],
    })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      // Get whitespace after ""}", ignoring extra semicolon
      const before = statement.raw("after").replace(/;+/, "")
      if (before === undefined) { return }

      // Calculate index
      const statementString = statement.toString()
      let index = statementString.length - 1
      if (statementString[index - 1] === "\r") { index -= 1 }

      // Set expectation
      const expectEmptyLineBefore = (
        expectation === "always-multi-line"
        && !isSingleLineString(blockString(statement))
      ) ? true : false

      // Check for at least one empty line
      const emptyLineBefore = before.indexOf("\n\n") !== -1
        || before.indexOf("\n\r\n") !== -1

      // Return if the expectation is met
      if (expectEmptyLineBefore === emptyLineBefore) { return }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected
      report({
        message,
        result,
        ruleName,
        node: statement,
        index,
      })
    }
  }
}
