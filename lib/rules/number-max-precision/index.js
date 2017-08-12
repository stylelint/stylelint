"use strict";

const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const _ = require("lodash");
const valueParser = require("postcss-value-parser");

const ruleName = "number-max-precision";

const messages = ruleMessages(ruleName, {
  expected: (number, precision) =>
    `Expected "${number}" to be "${number.toFixed(precision)}"`
});

const rule = function(precision) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: precision,
      possible: [_.isNumber]
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

        const match = /\d*\.(\d+)/.exec(valueNode.value);

        if (match === null) {
          return;
        }

        if (match[1].length <= precision) {
          return;
        }

        report({
          result,
          ruleName,
          node,
          index: getIndex(node) + valueNode.sourceIndex + match.index,
          message: messages.expected(parseFloat(match[0]), precision)
        });
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
