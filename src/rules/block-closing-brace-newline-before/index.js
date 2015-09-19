import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "block-closing-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "}"`,
  expectedBeforeMultiLine: () => `Expected newline before "}" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "}" of a multi-line block`,
})

export default function (expectation) {
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

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {

      // Return early if blockless or has empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      const blockIsMultiLine = !isSingleLineString(cssStatementBlockString(statement))
      const after = statement.raw("after")

      if (typeof after === "undefined") { return }

      // We're really just checking whether a
      // newline *starts* the block's final space -- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (after[0] !== "\n" && after.substr(0, 2) !== "\r\n") {
        if (expectation === "always") {
          report({
            message: messages.expectedBefore(),
            node: statement,
            index: statement.toString().length - 2,
            result,
            ruleName,
          })
        } else if (blockIsMultiLine && expectation === "always-multi-line") {
          report({
            message: messages.expectedBeforeMultiLine(),
            node: statement,
            index: statement.toString().length - 2,
            result,
            ruleName,
          })
        }
      }
      if (after !== "") {
        if (expectation === "never") {
          report({
            message: messages.rejectedBefore(),
            node: statement,
            index: statement.toString().length - 2,
            result,
            ruleName,
          })
        } else if (blockIsMultiLine && expectation === "never-multi-line") {
          report({
            message: messages.rejectedBeforeMultiLine(),
            node: statement,
            index: statement.toString().length - 2,
            result,
            ruleName,
          })
        }
      }
    }
  }
}
