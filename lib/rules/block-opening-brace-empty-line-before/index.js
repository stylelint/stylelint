"use strict";

const beforeBlockString = require("../../utils/beforeBlockString");
const blockString = require("../../utils/blockString");
const hasBlock = require("../../utils/hasBlock");
const hasEmptyBlock = require("../../utils/hasEmptyBlock");
const hasEmptyLine = require("../../utils/hasEmptyLine");
const isSingleLineString = require("../../utils/isSingleLineString");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "block-opening-brace-empty-line-before";

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected empty line before "{"',
  expectedBeforeSingleLine: () =>
    'Expected newline before "{" of a single-line block',
  rejectedBeforeSingleLine: () =>
    'Unexpected empty line before "{" of a single-line block',
  expectedBeforeMultiLine: () =>
    'Expected empty line before "{" of a multi-line block',
  rejectedBeforeMultiLine: () =>
    'Unexpected empty line before "{" of a multi-line block',
  rejectedBefore: () => 'Unexpected empty line before "{"'
});

const rule = function(expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-single-line",
        "always-multi-line",
        "never-single-line",
        "never-multi-line",
        "never"
      ]
    });
    if (!validOptions) {
      return;
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check);
    root.walkAtRules(check);

    function check(statement) {
      const source = beforeBlockString(statement);
      const hasEmptyLineBefore = hasEmptyLine(source);
      const isSingleLine = isSingleLineString(blockString(statement));
      let message = "hey";

      // Return early if blockless or has empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) {
        return;
      }

      // Set expectation
      const followsRule = (() => {
        if (expectation === "always") {
          message = messages.expectedBefore();
          return hasEmptyLineBefore;
        } else if (expectation === "always-single-line") {
          message = messages.expectedBeforeSingleLine();
          return isSingleLine && hasEmptyLineBefore;
        } else if (expectation === "always-multi-line") {
          message = messages.expectedBeforeMultiLine();
          return !isSingleLine && hasEmptyLineBefore;
        } else if (expectation === "never-single-line") {
          message = messages.rejectedBeforeSingleLine();
          return isSingleLine && !hasEmptyLineBefore;
        } else if (expectation === "never-multi-line") {
          message = messages.rejectedBeforeMultiLine();
          return !isSingleLine && !hasEmptyLineBefore;
        } else {
          message = messages.rejectedBefore();
          return !hasEmptyLineBefore;
        }
      })();

      if (!followsRule) {
        report({
          message,
          node: statement,
          result,
          ruleName
        });
      }
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
