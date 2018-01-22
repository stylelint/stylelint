"use strict";

const isAutoprefixable = require("../../utils/isAutoprefixable");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const unprefixAtRule = require("postcss-unprefix/lib/clearAtRule");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "media-feature-name-no-vendor-prefix";
const reDevicePixelRatio = /-\w+-(?:\w+-)*device-pixel-ratio\b/gi;

const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected vendor-prefix "${name}"`
});

const rule = function(expectation, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation
    });
    if (!validOptions) {
      return;
    }

    root.walkAtRules(/^media$/i, atRule => {
      const params = atRule.params;

      if (!isAutoprefixable.mediaFeatureName(params)) {
        return;
      }
      reDevicePixelRatio.lastIndex = 0;
      const source = atRule.toString();
      let match;
      function exec() {
        return (match = reDevicePixelRatio.exec(source));
      }

      if (!exec()) {
        return;
      }

      // Fix
      if (context.fix) {
        unprefixAtRule(atRule);
        if (!atRule.parent || atRule.name !== atRule) {
          return;
        }
      }
      do {
        report({
          message: messages.rejected(match[0]),
          node: atRule,
          index: match.index,
          // word: match[0],
          result,
          ruleName
        });
      } while (exec());
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
