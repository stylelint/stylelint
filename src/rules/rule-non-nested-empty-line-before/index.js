import {
  hasEmptyLine,
  isSingleLineString,
  isStandardSyntaxRule,
  optionsHasKeyword,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-non-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before non-nested rule",
  rejected: "Unexpected empty line before non-nested rule",
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
        except: ["after-single-line-comment"],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isStandardSyntaxRule(rule)) { return }

      // Ignore nested rule sets
      if (rule.parent !== root) { return }

      // Ignore the first node
      if (rule === root.first) { return }

      checkRuleEmptyLineBefore({ rule, expectation, options, result, messages, checkedRuleName: ruleName })
    })
  }
}

export function checkRuleEmptyLineBefore({ rule, expectation, options, result, messages, checkedRuleName }) {

  let expectEmptyLineBefore = (expectation.indexOf("always") !== -1) ? true : false

  // Optionally ignore the expectation if a comment precedes this node
  if (optionsHasKeyword(options, "ignore", "after-comment")
    && rule.prev() && rule.prev().type === "comment") { return }

  // Ignore if the expectation is for multiple and the rule is single-line
  if (expectation.indexOf("multi-line") !== -1
    && isSingleLineString(rule.toString())) { return }

  // Optionally reverse the expectation for the first nested node
  if (optionsHasKeyword(options, "except", "first-nested")
    && rule === rule.parent.first) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  // Optionally reverse the expectation for single line comments
  if (
    optionsHasKeyword(options, "except", "after-single-line-comment")
    && rule.prev()
    && rule.prev().type === "comment"
    && isSingleLineString(rule.prev().toString())
  ) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  const hasEmptyLineBefore = hasEmptyLine(rule.raw("before"))

  // Return if the expectation is met
  if (expectEmptyLineBefore === hasEmptyLineBefore) { return }

  const message = expectEmptyLineBefore ? messages.expected : messages.rejected

  report({
    message,
    node: rule,
    result,
    ruleName: checkedRuleName,
  })
}
