"use strict";

const _ = require("lodash");
const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp");
const mediaParser = require("postcss-media-query-parser").default;
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "media-feature-name-value-whitelist";

const messages = ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Unexpected value "${value}" for media feature "${property}"`
});

const rule = function(whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isObject]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(/^media$/i, atRule => {
      mediaParser(atRule.params).walk(/^media-feature-expression$/i, node => {
        // Ignore boolean and range context
        if (node.value.indexOf(":") === -1) {
          return;
        }

        const mediaFeatureNode = _.find(node.nodes, { type: "media-feature" });
        const valueNode = _.find(node.nodes, { type: "value" });
        const mediaFeatureName = mediaFeatureNode.value;
        const value = valueNode.value;

        const featureWhitelist = _.find(whitelist, (v, whitelistFeatureName) =>
          matchesStringOrRegExp(mediaFeatureName, whitelistFeatureName)
        );

        if (featureWhitelist === undefined) {
          return;
        }

        if (matchesStringOrRegExp(value, featureWhitelist)) {
          return;
        }

        report({
          index: atRuleParamIndex(atRule) + valueNode.sourceIndex,
          message: messages.rejected(mediaFeatureName, value),
          node: atRule,
          ruleName,
          result
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
