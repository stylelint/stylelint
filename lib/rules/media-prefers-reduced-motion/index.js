"use strict";

const isCustomSelector = require("../../utils/isCustomSelector");
const isStandardSyntaxAtRule = require("../../utils/isStandardSyntaxAtRule");
const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule");
const isStandardSyntaxSelector = require("../../utils/isStandardSyntaxSelector");
const report = require("../../utils/report");
const ruleMessages = require("../../utils/ruleMessages");
const validateOptions = require("../../utils/validateOptions");

const ruleName = "media-prefers-reduced-motion";

const messages = ruleMessages(ruleName, {
  expected: selector =>
    `Expected ${selector} is used with @media (prefers-reduced-motion)`
});

function check(selector, node) {
  const declarations = node.nodes;
  const params = node.parent.params;
  const parentNodes = node.parent.nodes;
  const targetProperties = ["transition", "animation"];

  if (!declarations) return true;

  if (!isStandardSyntaxSelector(selector)) {
    return true;
  }

  if (isCustomSelector(selector)) {
    return true;
  }

  let currentSelector = null;

  const declarationsIsMatched = declarations.some(declaration => {
    const noMatchedParams =
      !params || params.indexOf("prefers-reduced-motion") === -1;
    const index = targetProperties.indexOf(declaration.prop);
    currentSelector = targetProperties[index];

    return index >= 0 && noMatchedParams;
  });

  if (!declarationsIsMatched) return true;

  if (declarationsIsMatched) {
    const parentMatchedNode = parentNodes.some(parentNode => {
      return parentNode.nodes.some(childrenNode => {
        const childrenNodes = childrenNode.nodes;

        if (
          !parentNode.params ||
          !Array.isArray(childrenNodes) ||
          selector !== childrenNode.selector
        )
          return false;

        const matchedChildrenNodes = childrenNodes.some(declaration => {
          const index = targetProperties.indexOf(declaration.prop);

          if (currentSelector !== targetProperties[index]) return false;

          return (
            index >= 0 &&
            parentNode.params.indexOf("prefers-reduced-motion") >= 0
          );
        });

        return matchedChildrenNodes;
      });
    });

    if (!parentMatchedNode) return false;

    return true;
  }

  return true;
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

      const isAccepted = check(selector, node);

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
