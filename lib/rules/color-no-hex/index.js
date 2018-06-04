"use strict";

const colorConverter = require("color");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const styleSearch = require("style-search");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "color-no-hex";

const messages = ruleMessages(ruleName, {
  rejected: hex => `Unexpected hex color "${hex}"`
});

const fixColorFormat = (value, fixer, declaration) => {
  try {
    const color = colorConverter(value);
    if (fixer.fixTo.indexOf("hsl") > -1) {
      return declaration.replace(value, color.hsl().string());
    }
    return declaration.replace(value, color.rgb().string());
  } catch (err) {
    return declaration;
  }
};

const rule = function(actual, options, context) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual,
      possible: ["rgb", "rgba", "hsl", "hsla", true]
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const declString = decl.toString();
      const fixPositions = [];

      styleSearch({ source: declString, target: "#" }, match => {
        // If there's not a colon, comma, or whitespace character before, we'll assume this is
        // not intended to be a hex color, but is instead something like the
        // hash in a url() argument
        if (!/[:,\s]/.test(declString[match.startIndex - 1])) {
          return;
        }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(
          declString.substr(match.startIndex)
        );
        if (!hexMatch) {
          return;
        }
        const hexValue = hexMatch[0];

        if (context.fix && actual !== true) {
          fixPositions.unshift({
            fixTo: actual,
            hexValue,
            startIndex: match.startIndex
          });

          return;
        }

        report({
          message: messages.rejected(hexValue),
          node: decl,
          index: match.startIndex,
          result,
          ruleName
        });
      });

      if (fixPositions.length) {
        fixPositions.forEach(fixPosition => {
          decl.value = fixColorFormat(
            fixPosition.hexValue,
            fixPosition,
            decl.value
          );
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
