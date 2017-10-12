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
  const correctQuote = expectation === "single" ? "'" : '"';

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

      const fixPositions = [];
      parseSelector(rule.selector, result, rule, selectorTree => {
        selectorTree.walkAttributes(attributeNode => {
          if (
            attributeNode.quoted &&
            attributeNode.value.indexOf(erroneousQuote) !== -1
          ) {
            const openIndex =
              // index of the start of our attribute node in our source
              attributeNode.sourceIndex +
              // length of our attribute
              attributeNode.attribute.length +
              // length of our operator , ie '='
              attributeNode.operator.length +
              // and the length of the quote
              erroneousQuote.length;

            if (context.fix) {
              const closeIndex =
                // our initial index
                openIndex +
                // the length of our value
                attributeNode.value.length -
                // with the length of our quote subtracted
                erroneousQuote.length;
              fixPositions.push(openIndex, closeIndex);
            } else {
              report({
                message: messages.expected(expectation),
                node: rule,
                index: openIndex,
                result,
                ruleName
              });
            }
          }
        });
      });
      fixPositions.forEach(fixIndex => {
        rule.selector = replaceQuote(rule.selector, fixIndex, correctQuote);
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
          const openIndex = valueNode.sourceIndex;
          if (context.fix) {
            const closeIndex =
              openIndex + valueNode.value.length + erroneousQuote.length;
            fixPositions.push(openIndex, closeIndex);
          } else {
            report({
              message: messages.expected(expectation),
              node,
              index: getIndex(node) + openIndex,
              result,
              ruleName
            });
          }
        }
      });

      fixPositions.forEach(fixIndex => {
        if (node.type === "atrule") {
          node.params = replaceQuote(node.params, fixIndex, correctQuote);
        } else {
          node.value = replaceQuote(node.value, fixIndex, correctQuote);
        }
      });
    }
  };
};

function replaceQuote(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}
rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
