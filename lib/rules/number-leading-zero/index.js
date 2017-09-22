"use strict";

const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "number-leading-zero";

const messages = ruleMessages(ruleName, {
  expected: "Expected a leading zero",
  rejected: "Unexpected leading zero"
});

const rule = function(expectation, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });
    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      if (atRule.name.toLowerCase() === "import") {
        return;
      }

      check(atRule, atRule.params, atRuleParamIndex);
    });

    root.walkDecls(decl => check(decl, decl.value, declarationValueIndex));

    function check(node, value, getIndex) {
      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) {
        return;
      }

      valueParser(value).walk(valueNode => {
        // Ignore `url` function
        if (
          valueNode.type === "function" &&
          valueNode.value.toLowerCase() === "url"
        ) {
          return false;
        }

        // Ignore strings, comments, etc
        if (valueNode.type !== "word") {
          return;
        }

        // Check leading zero
        if (expectation === "always") {
          const regexp = /(^|\D)(\.\d+)/;
          const match = regexp.exec(valueNode.value);

          if (match === null) {
            return;
          }

          if (context.fix) {
            if (node.value) {
              node.value = node.value.replace(regexp, "$10$2");
              return;
            }

            if (node.params) {
              node.params = node.params.replace(regexp, "$10$2");
              return;
            }
          }

          // The regexp above consists of 2 capturing groups (or capturing parentheses).
          // We need the index of the second group. This makes sanse when we have "-.5" as an input
          // for regex. And we need the index of ".5".
          const capturingGroupIndex = match[0].length - match[2].length;

          complain(
            messages.expected,
            node,
            getIndex(node) +
              valueNode.sourceIndex +
              match.index +
              capturingGroupIndex
          );
        }

        if (expectation === "never") {
          const regexp = /(^|\D)(0+)(\.\d+)/;
          const match = regexp.exec(valueNode.value);

          if (match === null) {
            return;
          }

          if (context.fix) {
            if (node.value) {
              node.value = node.value.replace(regexp, "$1$3");
              return;
            }

            if (node.params) {
              node.params = node.params.replace(regexp, "$1$3");
              return;
            }
          }

          const capturingGroupIndex =
            match[0].length - (match[2].length + match[3].length);

          complain(
            messages.rejected,
            node,
            getIndex(node) +
              valueNode.sourceIndex +
              match.index +
              capturingGroupIndex
          );
        }
      });
    }

    function complain(message, node, index) {
      report({
        result,
        ruleName,
        message,
        node,
        index
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
