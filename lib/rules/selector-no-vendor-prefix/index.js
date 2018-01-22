"use strict";

const isAutoprefixable = require("../../utils/isAutoprefixable");
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector");
const parseSelector = require("../../utils/parseSelector");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const unprefixRule = require("postcss-unprefix/lib/clearRule");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "selector-no-vendor-prefix";

const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected vendor-prefix "${selector}"`
});

const rule = function(expectation, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation
    });
    if (!validOptions) {
      return;
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return;
      }
      const selector = rule.selector;

      if (!isStandardSyntaxSelector(selector)) {
        return;
      }

      // Fix
      if (context.fix) {
        unprefixRule(rule);
        if (!rule.parent || rule.selector !== selector) {
          return;
        }
      }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          if (isAutoprefixable.selector(pseudoNode.value)) {
            report({
              result,
              ruleName,
              message: messages.rejected(pseudoNode.value),
              node: rule,
              index: (rule.raws.before || "").length + pseudoNode.sourceIndex
            });
          }
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
