"use strict";

const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const parseSelector = require("../../utils/parseSelector");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "string-quotes";

const messages = ruleMessages(ruleName, {
  expected: q => `Expected ${q} quotes`
});

const rule = function(expectation, secondary, context) {
  const erroneousQuote = expectation === "single" ? '"' : "'";

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["single", "double"]
    });
    if (!validOptions) {
      return;
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return;
      }
      if (
        rule.selector.indexOf("[") === -1 ||
        rule.selector.indexOf("=") === -1
      ) {
        return;
      }

      parseSelector(rule.selector, result, rule, selectorTree => {
        selectorTree.walkAttributes(attributeNode => {
          if (
            attributeNode.quoted &&
            attributeNode.value.indexOf(erroneousQuote) !== -1
          ) {
            // index of the start of our attribute node in our source
            const index =
              attributeNode.sourceIndex +
              // length of our attribute
              attributeNode.attribute.length +
              // length of our operator , ie '='
              attributeNode.operator.length +
              // add 1 for the length of the quote
              1;
            report({
              message: messages.expected(expectation),
              node: rule,
              index,
              result,
              ruleName
            });
          }
        });
      });
    });

    root.walkAtRules(atRule => {
      check(atRule, atRule.params, atRuleParamIndex);
    });

    root.walkDecls(decl => check(decl, decl.value, declarationValueIndex));

    function check(node, value, getIndex) {
      const fixPositions = [];
      // Get out quickly if there are no erroneous quotes
      if (value.indexOf(erroneousQuote) === -1) {
        return;
      } else if (node.type === "atrule" && node.name === "charset") {
        // allow @charset rules to have double quotes, in spite of the configuration
        return;
      }

      valueParser(value).walk(valueNode => {
        if (valueNode.type === "string" && valueNode.quote === erroneousQuote) {
          report({
            message: messages.expected(expectation),
            node,
            index: getIndex(node) + valueNode.sourceIndex,
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
