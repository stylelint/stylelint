"use strict"

const addEmptyLineBefore = require("../../utils/addEmptyLineBefore")
const hasEmptyLine = require("../../utils/hasEmptyLine")
const isSingleLineString = require("../../utils/isSingleLineString")
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const optionsMatches = require("../../utils/optionsMatches")
const removeEmptyLinesBefore = require("../../utils/removeEmptyLinesBefore")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "rule-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before rule",
  rejected: "Unexpected empty line before rule",
})

const rule = function (expectation, options, context) {
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
        ignore: [
          "after-comment",
          "inside-block",
        ],
        except: [
          "after-rule",
          "after-single-line-comment",
          "first-nested",
          "inside-block-and-after-rule",
        ],
      },
      optional: true,
    })

    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }

      // Ignore the first node
      if (rule === root.first) {
        return
      }

      let expectEmptyLineBefore = expectation.indexOf("always") !== -1 ? true : false

      // Optionally ignore the expectation if a comment precedes this node
      if (
        optionsMatches(options, "ignore", "after-comment")
        && rule.prev()
        && rule.prev().type === "comment"
      ) {
        return
      }

      // Optionally ignore the expectation if inside a block
      if (
        optionsMatches(options, "ignore", "inside-block")
        && rule.parent !== root
      ) {
        return
      }

      // Ignore if the expectation is for multiple and the rule is single-line
      if (
        expectation.indexOf("multi-line") !== -1
        && isSingleLineString(rule.toString())
      ) {
        return
      }

      // Optionally reverse the expectation for the first nested node
      if (
        optionsMatches(options, "except", "first-nested")
        && rule === rule.parent.first
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a rule precedes this node
      if (
        optionsMatches(options, "except", "after-rule")
        && rule.prev()
        && rule.prev().type === "rule"
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation if a rule precedes this node and is inside a block
      if (
        optionsMatches(options, "except", "inside-block-and-after-rule")
        && rule.prev()
        && rule.prev().type === "rule"
        && rule.parent !== root
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Optionally reverse the expectation for single line comments
      if (
        optionsMatches(options, "except", "after-single-line-comment")
        && rule.prev()
        && rule.prev().type === "comment"
        && isSingleLineString(rule.prev().toString())
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      const hasEmptyLineBefore = hasEmptyLine(rule.raws.before)

      // Return if the expectation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) {
        return
      }

      // Fix
      if (context.fix) {
        if (expectEmptyLineBefore) {
          addEmptyLineBefore(rule, context.newline)
        } else {
          removeEmptyLinesBefore(rule, context.newline)
        }

        return
      }

      const message = expectEmptyLineBefore ? messages.expected : messages.rejected

      report({
        message,
        node: rule,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
