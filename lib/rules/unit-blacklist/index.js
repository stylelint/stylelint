"use strict";

const _ = require("lodash");
const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const getUnitFromValueNode = require("../../utils/getUnitFromValueNode");
const mediaParser = require("postcss-media-query-parser").default;
const optionsMatches = require("../../utils/optionsMatches");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateObjectWithStringArrayProps = require("../../utils/validateObjectWithStringArrayProps");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "unit-blacklist";

const messages = ruleMessages(ruleName, {
  rejected: unit => `Unexpected unit "${unit}"`
});

// a function to retrieve only the media feature name
// could be externalized in an utils function if needed in other code
const getMediaFeatureName = mediaFeatureNode => {
  const value = mediaFeatureNode.value.toLowerCase();

  return /((-?\w*)*)/i.exec(value)[1];
};

const rule = function(blacklistInput, options) {
  const blacklist = [].concat(blacklistInput);
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: blacklist,
        possible: [_.isString]
      },
      {
        optional: true,
        actual: options,
        possible: {
          ignoreProperties: validateObjectWithStringArrayProps,
          ignoreMediaFeatureNames: validateObjectWithStringArrayProps
        }
      }
    );
    if (!validOptions) {
      return;
    }

    function checkMedia(node, value, getIndex) {
      value = value.replace(/\*/g, ",");

      mediaParser(node.params).walk(/^media-feature$/i, mediaFeatureNode => {
        const mediaName = getMediaFeatureName(mediaFeatureNode),
          parentValue = mediaFeatureNode.parent.value;

        valueParser(value).walk(function(valueNode) {
          // Ignore all non-word valueNode and
          // the values not included in the parentValue string
          if (
            valueNode.type !== "word" ||
            !parentValue.includes(valueNode.value)
          ) {
            return;
          }

          const unit = getUnitFromValueNode(valueNode);
          if (!unit || (unit && blacklist.indexOf(unit.toLowerCase()) === -1)) {
            return;
          }

          if (
            options &&
            optionsMatches(
              options.ignoreMediaFeatureNames,
              unit.toLowerCase(),
              mediaName
            )
          ) {
            return;
          }
          report({
            index: getIndex(node) + valueNode.sourceIndex,
            message: messages.rejected(unit),
            node,
            result,
            ruleName
          });
        });
        return;
      });
    }

    function checkDecl(node, value, getIndex) {
      // make sure multiplication operations (*) are divided - not handled
      // by postcss-value-parser
      value = value.replace(/\*/g, ",");

      valueParser(value).walk(function(valueNode) {
        // Ignore wrong units within `url` function
        if (
          valueNode.type === "function" &&
          valueNode.value.toLowerCase() === "url"
        ) {
          return false;
        }

        const unit = getUnitFromValueNode(valueNode);

        if (!unit || (unit && blacklist.indexOf(unit.toLowerCase()) === -1)) {
          return;
        }

        if (
          options &&
          optionsMatches(
            options.ignoreProperties,
            unit.toLowerCase(),
            node.prop
          )
        ) {
          return;
        }

        report({
          index: getIndex(node) + valueNode.sourceIndex,
          message: messages.rejected(unit),
          node,
          result,
          ruleName
        });
      });
    }

    root.walkAtRules(/^media$/i, atRule =>
      checkMedia(atRule, atRule.params, atRuleParamIndex)
    );
    root.walkDecls(decl => checkDecl(decl, decl.value, declarationValueIndex));
  };
};

rule.primaryOptionArray = true;

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
