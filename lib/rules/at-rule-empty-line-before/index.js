"use strict"

const _ = require("lodash")
const addEmptyLineBefore = require("../../utils/addEmptyLineBefore")
const hasBlock = require("../../utils/hasBlock")
const hasEmptyLine = require("../../utils/hasEmptyLine")
const optionsMatches = require("../../utils/optionsMatches")
const removeEmptyLinesBefore = require("../../utils/removeEmptyLinesBefore")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "at-rule-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before at-rule",
  rejected: "Unexpected empty line before at-rule",
})

const rule = function (expectation, options, context) {
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
        except: [
          "after-same-name",
          "all-nested",
          "inside-block",
          "blockless-after-same-name-blockless",
          "blockless-group",
          "blockless-after-blockless",
          "first-nested",
        ],
        ignore: [
          "after-comment",
          "all-nested",
          "inside-block",
          "blockless-after-same-name-blockless",
          "blockless-group",
          "blockless-after-blockless",
        ],
        ignoreAtRules: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    if (
      optionsMatches(options, "ignore", "all-nested")
      || optionsMatches(options, "except", "all-nested")
    ) {
      result.warn((
        "'at-rule-empty-line-before\'s' \"all-nested\" option has been deprecated and in 8.0 will be removed. " +
        "Instead use the \"inside-block\" option."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "https://stylelint.io/user-guide/rules/at-rule-empty-line-before/",
      })
    }

    if (
      optionsMatches(options, "ignore", "blockless-group")
      || optionsMatches(options, "except", "blockless-group")
    ) {
      result.warn((
        "'at-rule-empty-line-before\'s' \"blockless-group\" option has been deprecated and in 8.0 will be removed. " +
        "Instead use the \"blockless-after-blockless\" option."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "https://stylelint.io/user-guide/rules/at-rule-empty-line-before/",
      })
    }

    root.walkAtRules(atRule => {
      // Ignore the first node
      if (atRule === root.first) {
        return
      }

      // Return early if at-rule is to be ignored
      if (optionsMatches(options, "ignoreAtRules", atRule.name)) {
        return
      }

      // Optionally ignore the expectation if the node is blockless
      if (
        optionsMatches(options, "ignore", "blockless-group")
        && !hasBlock(atRule)
        || optionsMatches(options, "ignore", "blockless-after-blockless")
        && !hasBlock(atRule)
      ) {
        return
      }

      const isNested = atRule.parent !== root
      const previousNode = atRule.prev()

      // Optionally ignore the expection if the node is blockless
      // and following another blockless at-rule with the same name
      if (
        optionsMatches(options, "ignore", "blockless-after-same-name-blockless")
        && isBlocklessAfterSameNameBlockless()
      ) {
        return
      }

      // Optionally ignore the expectation if the node is inside a block
      if (
        optionsMatches(options, "ignore", "all-nested")
        && isNested
        || optionsMatches(options, "ignore", "inside-block")
        && isNested
      ) {
        return
      }

      // Optionally ignore the expectation if a comment precedes this node
      if (
        optionsMatches(options, "ignore", "after-comment")
        && isAfterComment()
      ) {
        return
      }

      const hasEmptyLineBefore = hasEmptyLine(atRule.raws.before)
      let expectEmptyLineBefore = expectation === "always"
        ? true
        : false

      // Optionally reverse the expectation if any exceptions apply
      if (
        optionsMatches(options, "except", "after-same-name")
        && isAfterSameName()
        || optionsMatches(options, "except", "all-nested")
        && isNested
        || optionsMatches(options, "except", "inside-block")
        && isNested
        || optionsMatches(options, "except", "first-nested")
        && isFirstNested()
        || optionsMatches(options, "except", "blockless-group")
        && isBlocklessAfterBlockless()
        || optionsMatches(options, "except", "blockless-after-blockless")
        && isBlocklessAfterBlockless()
        || optionsMatches(options, "except", "blockless-after-same-name-blockless")
        && isBlocklessAfterSameNameBlockless()
      ) {
        expectEmptyLineBefore = !expectEmptyLineBefore
      }

      // Return if the expectation is met
      if (expectEmptyLineBefore === hasEmptyLineBefore) {
        return
      }

      // Fix
      if (context.fix) {
        if (expectEmptyLineBefore) {
          addEmptyLineBefore(atRule, context.newline)
        } else {
          removeEmptyLinesBefore(atRule, context.newline)
        }

        return
      }

      const message = expectEmptyLineBefore
        ? messages.expected
        : messages.rejected

      report({ message, node: atRule, result, ruleName })

      function isAfterComment() {
        return previousNode
          && previousNode.type === "comment"
      }

      function isBlocklessAfterBlockless() {
        return previousNode
          && previousNode.type === "atrule"
          && !hasBlock(previousNode)
          && !hasBlock(atRule)
      }

      function isBlocklessAfterSameNameBlockless() {
        return !hasBlock(atRule)
          && previousNode
          && !hasBlock(previousNode)
          && previousNode.type === "atrule"
          && previousNode.name == atRule.name
      }

      function isAfterSameName() {
        return previousNode
          && previousNode.type === "atrule"
          && previousNode.name === atRule.name
      }

      function isFirstNested() {
        return isNested
          && atRule === atRule.parent.first
      }
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
