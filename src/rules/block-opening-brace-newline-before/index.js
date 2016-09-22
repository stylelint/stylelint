import {
  beforeBlockString,
  blockString,
  hasBlock,
  hasEmptyBlock,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected newline before \"{\"",
  expectedBeforeSingleLine: () => "Expected newline before \"{\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \"{\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected newline before \"{\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected whitespace before \"{\" of a multi-line block",
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
      // Return early if blockless or has an empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const source = beforeBlockString(statement)
      const beforeBraceNoRaw = beforeBlockString(statement, { noRawBefore: true })

      let index = beforeBraceNoRaw.length - 1
      if (beforeBraceNoRaw[index - 1] === "\r") { index -= 1 }

      checker.beforeAllowingIndentation({
        lineCheckStr: blockString(statement),
        source,
        index: source.length,
        err: m => {
          report({
            message: m,
            node: statement,
            index,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
