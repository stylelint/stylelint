import { startsWith } from "lodash"
import {
  blockString,
  hasBlock,
  hasEmptyBlock,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "block-closing-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: "Expected newline before \"}\"",
  expectedBeforeMultiLine: "Expected newline before \"}\" of a multi-line block",
  rejectedBeforeMultiLine: "Unexpected whitespace before \"}\" of a multi-line block",
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
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      // Ignore extra semicolon
      const after = statement.raw("after").replace(/;+/, "")
      if (after === undefined) { return }

      const blockIsMultiLine = !isSingleLineString(blockString(statement))
      const statementString = statement.toString()

      let index = statementString.length - 2
      if (statementString[index - 1] === "\r") { index -= 1 }

      // We're really just checking whether a
      // newline *starts* the block's final space -- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (!startsWith(after, "\n") && !startsWith(after, "\r\n")) {
        if (expectation === "always") {
          complain(messages.expectedBefore)
        } else if (blockIsMultiLine && expectation === "always-multi-line") {
          complain(messages.expectedBeforeMultiLine)
        }
      }
      if (after !== "" && blockIsMultiLine && expectation === "never-multi-line") {
        complain(messages.rejectedBeforeMultiLine)
      }

      function complain(message) {
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
}
