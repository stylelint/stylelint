"use strict";

const mediaParser = require("postcss-media-query-parser").default;
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
    let mediaQueries = [];

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
      const media = mediaParser(valueParser.stringify(params.slice(1)))
        .nodes.map(n => n.value)
        .filter(n => n.length);

      const uriDuplicate = values.indexOf(uri) !== -1;
      const mediaDuplicate =
        mediaQueries.every(q => media.indexOf(q) !== -1) ||
        media.every(q => mediaQueries.indexOf(q) !== -1);

      if (uriDuplicate && mediaDuplicate) {
        report({
          message: messages.rejected(uri),
          node: atRule,
          result,
          ruleName
        });
        return;
      }

      values.push(uri);
      mediaQueries = mediaQueries.concat(media);
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
