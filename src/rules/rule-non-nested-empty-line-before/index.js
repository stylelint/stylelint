import {
  isSingleLineString,
  optionsHaveException,
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "rule-non-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: `Expected empty line before non-nested rule`,
  rejected: `Unexpected empty line before non-nested rule`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation, options) {
  return (root, result) => {
    root.eachRule(rule => {

      // Ignore nested rule sets
      if (rule.parent !== root) { return }

      // Ignore the first node
      if (rule === root.first) { return }

      checkRuleEmptyLineBefore(rule, expectation, options, result, messages)
    })
  }
}

export function checkRuleEmptyLineBefore(rule, expectation, options, result, msgs) {

  let expectEmptyLineBefore = (expectation.indexOf("always") !== -1) ? true : false

  // return if our exceptation if for multiple and the rule is single-line
  if (expectation.indexOf("multi-line") !== -1
      && isSingleLineString(rule.toString())) { return }

  // reverse the expectation for first nested node?
  if (options && optionsHaveException(options, "first-nested")
    && rule === rule.parent.first) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  const emptyLineBefore = rule.before.indexOf("\n\n") !== -1

  // return if our expectation is met
  if (expectEmptyLineBefore === emptyLineBefore) { return }

  const message = expectEmptyLineBefore ? msgs.expected : msgs.rejected

  report({
    message: message,
    node: rule,
    result,
    ruleName,
  })
}
