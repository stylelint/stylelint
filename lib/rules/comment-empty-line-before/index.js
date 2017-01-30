"use strict"

const hasEmptyLine = require("../../utils/hasEmptyLine")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "comment-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before comment",
  rejected: "Unexpected empty line before comment",
})

const stylelintCommandPrefix = "stylelint-"

const rule = function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    }, {
      actual: options,
      possible: {
        except: ["first-nested"],
        ignore: [
          "stylelint-commands",
          "stylelint-command",
          "between-comments",
          "after-comment",
        ],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    if (
      optionsMatches(options, "ignore", "between-comments")
    ) {
      result.warn((
        "'comment-empty-line-before\'s' \"between-comments\" option has been deprecated and in 8.0 will be removed. " +
        "Instead use the \"after-comment\" option."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "https://stylelint.io/user-guide/rules/comment-empty-line-before/",
      })
    }

    root.walkComments(comment => {
      // Ignore the first node
      if (comment === root.first) {
        return
      }

      // Optionally ignore stylelint commands
      if (
        comment.text.indexOf(stylelintCommandPrefix) === 0
        && optionsMatches(options, "ignore", "stylelint-commands")
      ) {
        return
      }

      // Optionally ignore newlines between comments
      const prev = comment.prev()
      if (
        prev
        && prev.type === "comment"
        && optionsMatches(options, "ignore", "between-comments")
      ) {
        return
      }

      if (
        prev
        && prev.type === "comment"
        && optionsMatches(options, "ignore", "after-comment")
      ) {
        return
      }

      if (
        comment.raws.inline
        || comment.inline
      ) {
        return
      }

      const before = (comment.raws.before || "")

      // Ignore shared-line comments
      if (before.indexOf("\n") === -1) {
        return
      }

      const expectEmptyLineBefore = (() => {
        if (
          optionsMatches(options, "except", "first-nested")
          && comment.parent !== root
          && comment === comment.parent.first
        ) {
          return false
        }
        return expectation === "always"
      })()

      const hasEmptyLineBefore = hasEmptyLine(before)

      // Return if the expectation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) {
        return
      }

      const message = expectEmptyLineBefore
        ? messages.expected
        : messages.rejected

      report({
        message,
        node: comment,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
