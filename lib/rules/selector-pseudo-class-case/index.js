"use strict";

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector");
const keywordSets = require("../../reference/keywordSets");
const parseSelector = require("../../utils/parseSelector");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "selector-pseudo-class-case";

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`
});

const rule = function(expectation, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["lower", "upper"]
    });
    if (!validOptions) {
      return;
    }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return;
      }

      rule.selectors.forEach(selector => {
        const startIndexPseudo = selector.indexOf(":");

        if (startIndexPseudo === -1) {
          return;
        }

        parseSelector(selector, result, rule, selectorTree => {
          selectorTree.walkPseudos(pseudoNode => {
            const pseudo = pseudoNode.value;

            if (!isStandardSyntaxSelector(pseudo)) {
              return;
            }

            if (
              pseudo.indexOf("::") !== -1 ||
              keywordSets.levelOneAndTwoPseudoElements.has(
                pseudo.toLowerCase().slice(1)
              )
            ) {
              return;
            }

            const expectedPseudo =
              expectation === "lower"
                ? pseudo.toLowerCase()
                : pseudo.toUpperCase();

            if (pseudo === expectedPseudo) {
              return;
            }

            if (context.fix) {
              const fixedSelector = selector.replace(pseudo, expectedPseudo);

              if (rule.raws.selector) {
                rule.raws.selector.raw = rule.raws.selector.raw.replace(
                  selector,
                  fixedSelector
                );
              } else {
                rule.selector = rule.selector.replace(selector, fixedSelector);
              }

              selector = fixedSelector;
              return;
            }

            report({
              message: messages.expected(pseudo, expectedPseudo),
              node: rule,
              index: pseudoNode.sourceIndex,
              ruleName,
              result
            });
          });
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
