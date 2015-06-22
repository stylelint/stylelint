import {
  hasBlock,
  hasEmptyBlock,
  isSingleLineString,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "block-closing-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "}"`,
  rejectedBefore: () => `Unexpected space before "}"`,
  expectedBeforeMultiLine: () => `Expected newline before "}" of a multi-line block`,
  rejectedBeforeMultiLine: () => `Unexpected space before "}" of a multi-line block`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return function (css, result) {

    // Check both kinds of statements: rules and at-rules
    css.eachRule(check)
    css.eachAtRule(check)

    function check(statement) {

      // return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      const statementString = statement.toString()

      // Sometimes at-rules do not have blocks (e.g. @import or @extend)
      const openingBraceIndex = statementString.indexOf("{")
      if (openingBraceIndex === -1) { return }
      const blockString = statementString.slice(openingBraceIndex)

      const blockIsMultiLine = !isSingleLineString(blockString)

      // We're really just checking whether a
      // newline *starts* the block's final space -- between
      // the last declaration and the closing brace. We can
      // ignore any other whitespace between them, because that
      // will be checked by the indentation rule.
      if (statement.after[0] !== "\n") {
        if (expectation === "always") {
          report({
            message: messages.expectedBefore(),
            node: statement,
            result,
            ruleName,
          })
        } else if (blockIsMultiLine && expectation === "always-multi-line") {
          report({
            message: messages.expectedBeforeMultiLine(),
            node: statement,
            result,
            ruleName,
          })
        }
      }
      if (statement.after) {
        if (expectation === "never") {
          report({
            message: messages.rejectedBefore(),
            node: statement,
            result,
            ruleName,
          })
        } else if (blockIsMultiLine && expectation === "never-multi-line") {
          report({
            message: messages.rejectedBeforeMultiLine(),
            node: statement,
            result,
            ruleName,
          })
        }
      }
    }
  }
}
