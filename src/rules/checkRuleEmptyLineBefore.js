const hasEmptyLine = require("../../utils/hasEmptyLine")
const isSingleLineString = require("../../utils/isSingleLineString")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")

module.exports = function (_ref) {
  let rule = _ref.rule,
    expectation = _ref.expectation,
    options = _ref.options,
    result = _ref.result,
    messages = _ref.messages,
    checkedRuleName = _ref.checkedRuleName

  let expectEmptyLineBefore = expectation.indexOf("always") !== -1 ? true : false

  // Optionally ignore the expectation if a comment precedes this node
  if (optionsMatches(options, "ignore", "after-comment") && rule.prev() && rule.prev().type === "comment") {
    return
  }

  // Ignore if the expectation is for multiple and the rule is single-line
  if (expectation.indexOf("multi-line") !== -1 && isSingleLineString(rule.toString())) {
    return
  }

  // Optionally reverse the expectation for the first nested node
  if (optionsMatches(options, "except", "first-nested") && rule === rule.parent.first) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  // Optionally reverse the expectation for single line comments
  if (optionsMatches(options, "except", "after-single-line-comment") && rule.prev() && rule.prev().type === "comment" && isSingleLineString(rule.prev().toString())) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  const hasEmptyLineBefore = hasEmptyLine(rule.raws.before)

  // Return if the expectation is met
  if (expectEmptyLineBefore === hasEmptyLineBefore) {
    return
  }

  const message = expectEmptyLineBefore ? messages.expected : messages.rejected

  report({
    message,
    node: rule,
    result,
    ruleName: checkedRuleName,
  })
}
