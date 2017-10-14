"use strict";

const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "no-duplicate-at-import-rules";

const messages = ruleMessages(ruleName, {
  rejected: atImport => `Unexpected duplicate @import rule "${atImport}`
});

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });
    if (!validOptions) {
      return;
    }

    const values = [];

    root.walkAtRules("import", atRule => {
      const param = atRule.params;
      const indexDuplicate = values.indexOf(param);

      if (indexDuplicate !== -1) {
        report({
          message: messages.rejected(param),
          node: atRule,
          result,
          ruleName
        });
      }
      values.push(param);
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
