"use strict";

const _ = require("lodash");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const isStandardSyntaxFunction = require("../../utils/isStandardSyntaxFunction");
const isStandardSyntaxValue = require("../../utils/isStandardSyntaxValue");
const keywordSets = require("../../reference/keywordSets");
const namedColorData = require("../../reference/namedColorData");
const optionsMatches = require("../../utils/optionsMatches");
const propertySets = require("../../reference/propertySets");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");
const valueParser = require("postcss-value-parser");

const ruleName = "color-named";

const messages = ruleMessages(ruleName, {
  expected: (named, original) => `Expected "${original}" to be "${named}"`,
  rejected: named => `Unexpected named color "${named}"`
});

// Todo tested on case insensivity
const NODE_TYPES = ["word", "function"];

const rule = function(expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["never", "always-where-possible"]
      },
      {
        actual: options,
        possible: {
          ignoreProperties: [_.isString],
          ignore: ["inside-function"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const namedColors = Object.keys(namedColorData);

    root.walkDecls(decl => {
      if (propertySets.acceptCustomIdents.has(decl.prop)) {
        return;
      }

      // Return early if the property is to be ignored
      if (optionsMatches(options, "ignoreProperties", decl.prop)) {
        return;
      }

      valueParser(decl.value).walk(node => {
        const value = node.value,
          type = node.type,
          sourceIndex = node.sourceIndex;

        if (
          optionsMatches(options, "ignore", "inside-function") &&
          type === "function"
        ) {
          return false;
        }

        if (!isStandardSyntaxFunction(node)) {
          return false;
        }

        if (!isStandardSyntaxValue(value)) {
          return;
        }
        // Return early if neither a word nor a function
        if (NODE_TYPES.indexOf(type) === -1) {
          return;
        }

        // Check for named colors for "never" option
        if (
          expectation === "never" &&
          type === "word" &&
          namedColors.indexOf(value.toLowerCase()) !== -1
        ) {
          complain(
            messages.rejected(value),
            decl,
            declarationValueIndex(decl) + sourceIndex
          );
          return;
        }

        // Check "always-where-possible" option ...
        if (expectation !== "always-where-possible") {
          return;
        }

        // First by checking for alternative color function representations ...
        if (
          type === "function" &&
          keywordSets.colorFunctionNames.has(value.toLowerCase())
        ) {
          // Remove all spaces to match what's in `representations`
          const normalizedFunctionString = valueParser
            .stringify(node)
            .replace(/\s+/g, "");
          let namedColor;
          for (let i = 0, l = namedColors.length; i < l; i++) {
            namedColor = namedColors[i];
            if (
              namedColorData[namedColor].func.indexOf(
                normalizedFunctionString.toLowerCase()
              ) !== -1
            ) {
              complain(
                messages.expected(namedColor, normalizedFunctionString),
                decl,
                declarationValueIndex(decl) + sourceIndex
              );
              return; // Exit as soon as a problem is found
            }
          }
          return;
        }

        // Then by checking for alternative hex representations
        let namedColor;
        for (let i = 0, l = namedColors.length; i < l; i++) {
          namedColor = namedColors[i];
          if (
            namedColorData[namedColor].hex.indexOf(value.toLowerCase()) !== -1
          ) {
            complain(
              messages.expected(namedColor, value),
              decl,
              declarationValueIndex(decl) + sourceIndex
            );
            return; // Exit as soon as a problem is found
          }
        }
      });
    });

    function complain(message, node, index) {
      report({
        result,
        ruleName,
        message,
        node,
        index
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
