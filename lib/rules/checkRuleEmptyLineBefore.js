"use strict"

const hasEmptyLine = require("../utils/hasEmptyLine")
const isSingleLineString = require("../utils/isSingleLineString")
const optionsMatches = require("../utils/optionsMatches")
const report = require("../utils/report")

module.exports = function (opts) {
  let expectEmptyLineBefore = opts.expectation.indexOf("always") !== -1 ? true : false

  // Optionally ignore the expectation if a comment precedes this node
  if (optionsMatches(opts.options, "ignore", "after-comment") && opts.rule.prev() && opts.rule.prev().type === "comment") {
    return
  }

  // Ignore if the expectation is for multiple and the rule is single-line
  if (opts.expectation.indexOf("multi-line") !== -1 && isSingleLineString(opts.rule.toString())) {
    return
  }

  // Optionally reverse the expectation for the first nested node
  if (optionsMatches(opts.options, "except", "first-nested") && opts.rule === opts.rule.parent.first) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  // Optionally reverse the expectation if a rule precedes this node
  if (optionsMatches(opts.options, "except", "after-rule") && opts.rule.prev() && opts.rule.prev().type === "rule") {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  // Optionally reverse the expectation for single line comments
  if (optionsMatches(opts.options, "except", "after-single-line-comment") && opts.rule.prev() && opts.rule.prev().type === "comment" && isSingleLineString(opts.rule.prev().toString())) {
    expectEmptyLineBefore = !expectEmptyLineBefore
  }

  const hasEmptyLineBefore = hasEmptyLine(opts.rule.raws.before)

  // Return if the expectation is met
  if (expectEmptyLineBefore === hasEmptyLineBefore) {
    return
  }

  const message = expectEmptyLineBefore ? opts.messages.expected : opts.messages.rejected

  report({
    message,
    node: opts.rule,
    result: opts.result,
    ruleName: opts.checkedRuleName,
  })
}
