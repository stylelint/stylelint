import {
  ruleMessages,
  isSingleLineString
} from "../../utils"

export const ruleName = "rule-set-non-nested-empty-newline-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty newline before non-nested rule set",
  rejected: "Unexpected empty newline before non-nested rule set",
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachRule(rule => {

      // Ignore the first node
      if (rule === root.first) { return }

      // Ignore nested rule sets
      if (rule.parent !== root) { return }

      const expectEmptyNewline = (expectation === "always"
        || expectation === "always-multi-line" && !isSingleLineString(rule.toString()))

      const rejectEmptyNewline = (expectation === "never"
        || expectation === "never-multi-line" && !isSingleLineString(rule.toString()))

      const emptyNewlineBefore = rule.before.indexOf("\n\n") !== -1
      if (expectEmptyNewline && !emptyNewlineBefore) {
        result.warn(messages.expected, { node: rule })
      }
      if (rejectEmptyNewline && emptyNewlineBefore) {
        result.warn(messages.rejected, { node: rule })
      }
    })
  }
}
