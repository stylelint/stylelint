"use strict";

const _ = require("lodash");
const beforeBlockString = require("../../utils/beforeBlockString");
const blockString = require("../../utils/blockString");
const hasBlock = require("../../utils/hasBlock");
const hasEmptyBlock = require("../../utils/hasEmptyBlock");
const optionsMatches = require("../../utils/optionsMatches");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const whitespaceChecker = require("../../utils/whitespaceChecker");

const ruleName = "block-opening-brace-space-before";

const messages = ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before "{"',
  rejectedBefore: () => 'Unexpected whitespace before "{"',
  expectedBeforeSingleLine: () =>
    'Expected single space before "{" of a single-line block',
  rejectedBeforeSingleLine: () =>
    'Unexpected whitespace before "{" of a single-line block',
  expectedBeforeMultiLine: () =>
    'Expected single space before "{" of a multi-line block',
  rejectedBeforeMultiLine: () =>
    'Unexpected whitespace before "{" of a multi-line block'
});

const rule = function(expectation, options, context) {
  const checker = whitespaceChecker("space", expectation, messages);
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: [
          "always",
          "never",
          "always-single-line",
          "never-single-line",
          "always-multi-line",
          "never-multi-line"
        ]
      },
      {
        actual: options,
        possible: {
          ignoreAtRules: [_.isString]
        },
        optional: true
      }
    );
    if (!validOptions) {
      return;
    }

    // auto fix
    if (context.fix) {
      const match = /^ /;
      const replaceWithNoSpace = "";
      const replaceWithSpace = " ";
      if (
        expectation === "always" ||
        expectation === "always-single-line" ||
        expectation === "never-multi-line"
      ) {
        root.walkRules(rule => {
          // is rule or mixin ?
          if (rule.nodes) {
            rule.raws.between.match(match) === null
              ? (rule.raws.between = replaceWithSpace)
              : (rule.raws.between = replaceWithSpace);
          }
        });
        root.walkAtRules(atrule => {
          // is atrule ?
          if (atrule.type === "atrule") {
            atrule.raws.between.match(match) === null
              ? (atrule.raws.between = replaceWithSpace)
              : (atrule.raws.between = replaceWithSpace);
            // for like media query and keyframes animation
            if (
              atrule.name.match(/\b(media)\b/) !== null ||
              atrule.name.match(/\b(keyframes)\b/) !== null
            ) {
              atrule.raws.afterName.match(match) === null
                ? (atrule.raws.afterName = replaceWithSpace)
                : (atrule.raws.afterName = replaceWithSpace);
            } else {
              //for variables
              atrule.raws.afterName.match(match) === null
                ? (atrule.raws.afterName = replaceWithNoSpace)
                : (atrule.raws.afterName = replaceWithNoSpace); // for variable
            }
          }
        });
      }
    }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check);
    root.walkAtRules(check);

    function check(statement) {
      // Return early if blockless or has an empty block
      if (!hasBlock(statement) || hasEmptyBlock(statement)) {
        return;
      }

      // Return early if at-rule is to be ignored
      if (optionsMatches(options, "ignoreAtRules", statement.name)) {
        return;
      }

      const source = beforeBlockString(statement);
      const beforeBraceNoRaw = beforeBlockString(statement, {
        noRawBefore: true
      });

      let index = beforeBraceNoRaw.length - 1;
      if (beforeBraceNoRaw[index - 1] === "\r") {
        index -= 1;
      }

      checker.before({
        source,
        index: source.length,
        lineCheckStr: blockString(statement),
        err: m => {
          report({
            message: m,
            node: statement,
            index,
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
