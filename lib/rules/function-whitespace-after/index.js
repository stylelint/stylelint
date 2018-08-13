"use strict";

const _ = require("lodash");
const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const isWhitespace = require("../../utils/isWhitespace");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "function-whitespace-after";

const messages = ruleMessages(ruleName, {
  expected: 'Expected whitespace after ")"',
  rejected: 'Unexpected whitespace after ")"'
});

const ACCEPTABLE_AFTER_CLOSING_PAREN = new Set([
  ")",
  ",",
  "}",
  ":",
  "/",
  undefined
]);

const rule = function(expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });
    if (!validOptions) {
      return;
    }

    function check(node, value, getIndex) {
      styleSearch(
        {
          source: value,
          target: ")",
          functionArguments: "only"
        },
        match => {
          checkClosingParen(value, match.startIndex + 1, node, getIndex);
        }
      );
    }

    function checkClosingParen(source, index, node, getIndex) {
      const nextChar = source[index];
      if (expectation === "always") {
        // Allow for the next character to be a single empty space,
        // another closing parenthesis, a comma, or the end of the value
        if (nextChar === " ") {
          return;
        }
        if (nextChar === "\n") {
          return;
        }
        if (source.substr(index, 2) === "\r\n") {
          return;
        }
        if (ACCEPTABLE_AFTER_CLOSING_PAREN.has(nextChar)) {
          return;
        }
        report({
          message: messages.expected,
          node,
          index: getIndex(node) + index,
          result,
          ruleName
        });
      } else if (expectation === "never") {
        if (isWhitespace(nextChar)) {
          report({
            message: messages.rejected,
            node,
            index: getIndex(node) + index,
            result,
            ruleName
          });
        }
      }
    }

    root.walkAtRules(/^import$/i, atRule =>
      check(atRule, atRule.params, atRuleParamIndex)
    );
    root.walkDecls(decl =>
      check(
        decl,
        _.get(decl, "raws.value.raw", decl.value),
        declarationValueIndex
      )
    );
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
