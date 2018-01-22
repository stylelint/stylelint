"use strict";

const isAutoprefixable = require("../../utils/isAutoprefixable");
const isStandardSyntaxAtRule = require("../../utils/isStandardSyntaxAtRule");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const unprefixAtRule = require("postcss-unprefix/lib/clearAtRule");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "at-rule-no-vendor-prefix";

const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed at-rule "@${p}"`
});

const rule = function(expectation, options, context) {
  return function(root, result) {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation
    });
    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      if (!isStandardSyntaxAtRule(atRule)) {
        return;
      }

      const name = atRule.name;

      if (name[0] !== "-") {
        return;
      }

      if (!isAutoprefixable.atRuleName(name)) {
        return;
      }

      // Fix
      if (context.fix) {
        unprefixAtRule(atRule);
        if (!atRule.parent || atRule.name !== atRule) {
          return;
        }
      }

      report({
        message: messages.rejected(name),
        node: atRule,
        result,
        ruleName
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
