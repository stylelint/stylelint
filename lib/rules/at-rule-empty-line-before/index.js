"use strict"

const _ = require("lodash")
const getPreviousNonSharedLineCommentNode = require("../../utils/getPreviousNonSharedLineCommentNode")
const hasEmptyLine = require("../../utils/hasEmptyLine")
const isAfterCommentLine = require("../../utils/isAfterCommentLine")
const isBlocklessAtRuleAfterBlocklessAtRule = require("../../utils/isBlocklessAtRuleAfterBlocklessAtRule")
const isBlocklessAtRuleAfterSameNameBlocklessAtRule = require("../../utils/isBlocklessAtRuleAfterSameNameBlocklessAtRule")
const isFirstNested = require("../../utils/isFirstNested")
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
      const isNested = atRule.parent !== root

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
        && isBlocklessAtRuleAfterBlocklessAtRule(atRule)
        || optionsMatches(options, "ignore", "blockless-after-blockless")
        && isBlocklessAtRuleAfterBlocklessAtRule(atRule)
      ) {
        return
      }

      // Optionally ignore the expection if the node is blockless
      // and following another blockless at-rule with the same name
      if (
        optionsMatches(options, "ignore", "blockless-after-same-name-blockless")
        && isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule)
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
        && isAfterCommentLine(atRule)
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
        && isAtRuleAfterSameNameAtRule(atRule)
        || optionsMatches(options, "except", "all-nested")
        && isNested
        || optionsMatches(options, "except", "inside-block")
        && isNested
        || optionsMatches(options, "except", "first-nested")
        && isFirstNested(atRule)
        || optionsMatches(options, "except", "blockless-group")
        && isBlocklessAtRuleAfterBlocklessAtRule(atRule)
        || optionsMatches(options, "except", "blockless-after-blockless")
        && isBlocklessAtRuleAfterBlocklessAtRule(atRule)
        || optionsMatches(options, "except", "blockless-after-same-name-blockless")
        && isBlocklessAtRuleAfterSameNameBlocklessAtRule(atRule)
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
    })
  }
}

function isAtRuleAfterSameNameAtRule(atRule) {
  const previousNode = getPreviousNonSharedLineCommentNode(atRule)
  return previousNode
    && previousNode.type === "atrule"
    && previousNode.name === atRule.name
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
