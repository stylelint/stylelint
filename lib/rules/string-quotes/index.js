"use strict";

const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "string-quotes";

const messages = ruleMessages(ruleName, {
  expected: q => `Expected ${q} quotes`
});

const rule = function(expectation) {
  const erroneousQuote = expectation === "single" ? '"' : "'";

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["single", "double"]
    });
    if (!validOptions) {
      return;
    }

    let cssString = root.toString();

    // allow @charset rules to have double quotes, in spite of the configuration
    if (erroneousQuote === '"') {
      root.walkAtRules(atRule => {
        if (atRule.name === "charset") {
          const badAtRule = atRule.toString();
          const goodAtRule = badAtRule.split('"').join("'");
          cssString = cssString.replace(badAtRule, goodAtRule);
        }
      });
    }

    styleSearch({ source: cssString, target: erroneousQuote }, match => {
      report({
        message: messages.expected(expectation),
        node: root,
        index: match.startIndex,
        result,
        ruleName
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
