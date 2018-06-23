"use strict";

const beforeBlockString = require("../../utils/beforeBlockString");
const blockString = require("../../utils/blockString");
const hasBlock = require("../../utils/hasBlock");
const hasEmptyBlock = require("../../utils/hasEmptyBlock");
const rawNodeString = require("../../utils/rawNodeString");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const whitespaceChecker = require("../../utils/whitespaceChecker");

const ruleName = "block-opening-brace-newline-after";

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected newline after "{"',
  expectedAfterMultiLine: () =>
    'Expected newline after "{" of a multi-line block',
  rejectedAfterMultiLine: () =>
    'Unexpected whitespace after "{" of a multi-line block'
});

const rule = function(expectation) {
  const checker = whitespaceChecker("newline", expectation, messages);

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "always-multi-line", "never-multi-line"]
    });
    if (!validOptions) {
      return;
    }

    // Check both kinds of statement: rules and at-rules
    root.walkRules(check);
    root.walkAtRules(check);

    function check(statement) {
      // Return early if blockless or has an empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) {
        return;
      }

      // next node with checking newlines after comment
      function nextNode(startNode) {
        if (!startNode || !startNode.next) return null;

        if (startNode.type === "comment") {
          const reNewLine = /\r?\n/;
          const newLineMatch = reNewLine.test(startNode.raws.before);

          const next = startNode.next();
          if (next && newLineMatch && !reNewLine.test(next.raws.before)) {
            next.raws.before = startNode.raws.before;
          }
          return nextNode(next);
        }

        return startNode;
      }

      // Allow an end-of-line comment
      const nodeToCheck = nextNode(statement.first);
      if (!nodeToCheck) {
        return;
      }

      checker.afterOneOnly({
        source: rawNodeString(nodeToCheck),
        index: -1,
        lineCheckStr: blockString(statement),
        err: m => {
          report({
            message: m,
            node: statement,
            index:
              beforeBlockString(statement, { noRawBefore: true }).length + 1,
            result,
            ruleName
          });
        }
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
