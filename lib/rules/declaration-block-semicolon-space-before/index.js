"use strict";

const blockString = require("../../utils/blockString");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const whitespaceChecker = require("../../utils/whitespaceChecker");

const ruleName = "declaration-block-semicolon-space-before";

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ";"',
  rejectedBefore: () => 'Unexpected whitespace before ";"',
  expectedBeforeSingleLine: () =>
    'Expected single space before ";" in a single-line declaration block',
  rejectedBeforeSingleLine: () =>
    'Unexpected whitespace before ";" in a single-line declaration block'
});

const rule = function(expectation) {
  const checker = whitespaceChecker("space", expectation, messages);

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never", "always-single-line", "never-single-line"]
    });
    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent;
      if (!parentRule.raws.semicolon && parentRule.last === decl) {
        return;
      }

      const declString = decl.toString();

      checker.before({
        source: declString,
        index: declString.length,
        lineCheckStr: blockString(parentRule),
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.toString().length - 1,
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
