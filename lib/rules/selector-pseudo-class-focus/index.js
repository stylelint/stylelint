"use strict";

const isCustomSelector = require("../../utils/isCustomSelector");
const isStandardSyntaxAtRule = require("../../utils/isStandardSyntaxAtRule");
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "selector-pseudo-class-focus";

const messages = ruleMessages(ruleName, {
  expected: value =>
    `Expected that ${value} is used together with :focus pseudo-class`
});

function check(selector) {
  if (
    selector.match(/:focus/gi) ||
    (selector.match(/:hover/gi) && selector.match(/:focus/gi)) ||
    (!selector.match(/:hover/gi) && !selector.match(/:focus/gi))
  ) {
    return true;
  }

  if (!isStandardSyntaxSelector(selector)) {
    return true;
  }

  if (isCustomSelector(selector)) {
    return true;
  }

  return false;
}

const rule = function(actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions || !actual) {
      return;
    }

    root.walk(node => {
      let selector = null;

      if (node.type === "rule") {
        if (!isStandardSyntaxRule(node)) {
          return;
        }

        selector = node.selector;
      } else if (
        node.type === "atrule" &&
        node.name === "page" &&
        node.params
      ) {
        if (!isStandardSyntaxAtRule(node)) {
          return;
        }

        selector = node.params;
      }

      if (!selector) {
        return;
      }

      if (selector.indexOf(":") === -1) {
        return;
      }

      const parentNodes = node.parent.nodes;
      let isAccepted = null;

      if (parentNodes.length > 1) {
        const checkParentNodes = parentNodes
          .map(parentNode => {
            return check(parentNode.selector);
          })
          .filter(Boolean);

        isAccepted = !!checkParentNodes;
      } else {
        isAccepted = check(selector);
      }

      if (!isAccepted) {
        report({
          index: node.lastEach,
          message: messages.expected(selector),
          node,
          ruleName,
          result
        });
      }
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;
