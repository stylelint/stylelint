"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const optionsMatches = require("../../utils/optionsMatches")
const checkRuleEmptyLineBefore = require("../checkRuleEmptyLineBefore")

const ruleName = "rule-nested-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before nested rule",
  rejected: "Unexpected empty line before nested rule",
})

const rule = function (expectation, options) {
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
        except: [
          "first-nested",
          "after-opening-brace",
          "after-comment",
          "after-rule",
        ],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    if (optionsMatches(options, "except", "first-nested")) {
      result.warn((
        "'rule-nested-empty-line-before\'s' \"first-nested\" option has been deprecated and in 8.0 will be removed. " +
        "Instead use the \"after-opening-brace\" option."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "http://stylelint.io/user-guide/rules/rule-nested-empty-line-before/",
      })
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }

      // Only attend to nested rule sets
      if (rule.parent === root) {
        return
      }

      checkRuleEmptyLineBefore({ rule, expectation, options, result, messages, checkedRuleName: ruleName })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
