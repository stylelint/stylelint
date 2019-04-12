"use strict";

const _ = require("lodash");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "max-lines";

const messages = ruleMessages(ruleName, {
  expected: (max, count) =>
    `Expected no more than ${max} ${max === 1 ? "line" : "lines"}. ` +
    `Found ${count} lines.`
});

const rule = function(max) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: _.isInteger
    });

    if (!validOptions) {
      return;
    }

    const { css } = root.source.input;

    const count = css.split(/\r\n|\n/).length;

    if (count <= max) {
      return;
    }

    return report({
      message: messages.expected(max, count),
      node: root,
      result,
      ruleName
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;

module.exports = rule;
