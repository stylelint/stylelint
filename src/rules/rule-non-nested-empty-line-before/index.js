import {
  isSingleLineString,
  optionsHaveException,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "rule-non-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: `Expected empty line before non-nested rule`,
  rejected: `Unexpected empty line before non-nested rule`,
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-multi-line",
        "never-multi-line",
      ],
    }, {
      actual: options,
      possible: {
        ignore: ["after-comment"],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

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

  // Optionally ignore the expectation if a comment precedes this node
  if (optionsHaveIgnored(options, "after-comment")
    && rule.prev() && rule.prev().type === "comment") { return }

  // Ignore if the exceptation is for multiple and the rule is single-line
  if (expectation.indexOf("multi-line") !== -1
    && isSingleLineString(rule.toString())) { return }

  // Optionally reverse the expectation for the first nested node
  if (optionsHaveException(options, "first-nested")
    && rule === rule.parent.first) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  const emptyLineBefore = rule.raws.before.indexOf("\n\n") !== -1
    || rule.raws.before.indexOf("\r\n\r\n") !== -1

  // Return if the exceptation is met
  if (expectEmptyLineBefore === emptyLineBefore) { return }

  const message = expectEmptyLineBefore ? msgs.expected : msgs.rejected

  report({
    message: message,
    node: rule,
    result,
    ruleName,
  })
}
