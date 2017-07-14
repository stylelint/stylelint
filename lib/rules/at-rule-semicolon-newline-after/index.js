"use strict";

const hasBlock = require("../../utils/hasBlock");
const nextNonCommentNode = require("../../utils/nextNonCommentNode");
const rawNodeString = require("../../utils/rawNodeString");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const whitespaceChecker = require("../../utils/whitespaceChecker");

const ruleName = "at-rule-semicolon-newline-after";

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after ";"'
});

const rule = function(actual) {
  const checker = whitespaceChecker("newline", actual, messages);

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual,
      possible: ["always"]
    });
    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      const nextNode = atRule.next();
      if (!nextNode) {
        return;
      }
      if (hasBlock(atRule)) {
        return;
      }

      // Allow an end-of-line comment
      const nodeToCheck = nextNonCommentNode(nextNode);
      if (!nodeToCheck) {
        return;
      }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        err: msg => {
          report({
            message: msg,
            node: atRule,
            index: atRule.toString().length + 1,
            result,
            ruleName
          });
        }
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
