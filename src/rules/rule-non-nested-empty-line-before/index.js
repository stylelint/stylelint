import {
  report,
  ruleMessages,
  isSingleLineString
} from "../../utils"

export const ruleName = "rule-non-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: `Expected empty line before non-nested rule`,
  rejected: `Unexpected empty line before non-nested rule`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachRule(rule => {

      // Ignore nested rule sets
      if (rule.parent !== root) { return }

      // Ignore the first node
      if (rule === root.first) { return }

      checkRuleEmptyLineBefore(rule, expectation, result, messages)
    })
  }
}

export function checkRuleEmptyLineBefore(rule, expectation, result, msgs) {

  const expectEmptyLine = expectation === "always"
    || (expectation === "always-except-first"
      && rule !== rule.parent.first)
    || (expectation === "always-multi-line"
      && !isSingleLineString(rule.toString()))
    || (expectation === "always-multi-line-except-first"
      && rule !== rule.parent.first
      && !isSingleLineString(rule.toString()))

  const rejectEmptyLine = expectation === "never"
    || (expectation === "always-except-first"
      && rule === rule.parent.first)
    || (expectation === "never-multi-line"
      && !isSingleLineString(rule.toString()))
    || (expectation === "always-multi-line-except-first"
      && rule === rule.parent.first
      && !isSingleLineString(rule.toString()))

  const emptyLineBefore = rule.before.indexOf("\n\n") !== -1

  if (expectEmptyLine && !emptyLineBefore) {
    report({
      message: msgs.expected,
      node: rule,
      result,
      ruleName,
    })
  }
  if (rejectEmptyLine && emptyLineBefore) {
    report({
      message: msgs.rejected,
      node: rule,
      result,
      ruleName,
    })
  }
}
