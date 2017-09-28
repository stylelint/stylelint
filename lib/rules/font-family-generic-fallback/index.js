"use strict";

const declarationValueIndex = require("../../utils/declarationValueIndex");
const findFontFamily = require("../../utils/findFontFamily");
const keywordSets = require("../../reference/keywordSets");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "font-family-generic-fallback";

const messages = ruleMessages(ruleName, {
  generic: () => "Missing generic font family, e.g. serif"
});

const isFamilyNameKeyword = node =>
  !node.quote && keywordSets.fontFamilyKeywords.has(node.value.toLowerCase());

const rule = function(actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      { actual },
      {
        actual: options,
        optional: true
      }
    );
    if (!validOptions) {
      return;
    }

    root.walkDecls(/^font(-family)?$/i, decl => {
      const fontFamilies = findFontFamily(decl.value);

      if (fontFamilies.length === 0) {
        return;
      }

      const lastFamilyNode = fontFamilies[fontFamilies.length - 1];
      if (isFamilyNameKeyword(lastFamilyNode)) {
        return;
      }

      complain(
        messages.generic(),
        declarationValueIndex(decl) + lastFamilyNode.sourceIndex,
        decl
      );
    });

    function complain(message, index, decl) {
      report({
        result,
        ruleName,
        message,
        node: decl,
        index
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
