"use strict"

const _ = require("lodash")
const hasBlock = require("../../utils/hasBlock")
const hasEmptyLine = require("../../utils/hasEmptyLine")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "at-rule-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before at-rule",
  rejected: "Unexpected empty line before at-rule",
})

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
        except: [
          "all-nested",
          "blockless-after-same-name-blockless",
          "blockless-group",
          "first-nested",
        ],
        ignore: [
          "after-comment",
          "all-nested",
          "blockless-after-same-name-blockless",
          "blockless-group",
        ],
        ignoreAtRules: [_.isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
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

      // Optionally ignore the expectation if the node is nested
      if (
        optionsMatches(options, "ignore", "all-nested")
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
        optionsMatches(options, "except", "all-nested")
        && isNested
        || optionsMatches(options, "except", "first-nested")
        && isFirstNested()
        || optionsMatches(options, "except", "blockless-group")
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
