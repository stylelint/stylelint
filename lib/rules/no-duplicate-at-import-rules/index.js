"use strict";

const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "no-duplicate-at-import-rules";

const messages = ruleMessages(ruleName, {
  rejected: atImport => `Unexpected duplicate @import rule ${atImport}`
});

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });
    if (!validOptions) {
      return;
    }

    const values = []; //uri
    const mediaQueries = [];

    root.walkAtRules("import", atRule => {
      const params = valueParser(atRule.params).nodes;
      if (!params.length) {
        return;
      }

      // extract uri from url() if exists
      const uri =
        params[0].type === "function" && params[0].value === "url"
          ? params[0].nodes[0].value
          : params[0].value;
      // extract media queries if any
      const media = params
        .slice(1)
        .map(x => x.value.trim())
        .filter(x => x.length)
        .join();

      const uriDuplicateIndex = values.indexOf(uri);
      const mediaDuplicateIndex = mediaQueries.indexOf(media);
      if (uriDuplicateIndex !== -1 && mediaDuplicateIndex !== -1) {
        report({
          message: messages.rejected(uri),
          node: atRule,
          result,
          ruleName
        });
        return;
      }

      values.push(uri);
      mediaQueries.push(media);
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
