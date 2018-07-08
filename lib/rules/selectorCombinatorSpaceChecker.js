"use strict";

const isStandardSyntaxRule = require("../utils/isStandardSyntaxRule");
const parseSelector = require("../utils/parseSelector");
const report = require("../utils/report");

module.exports = function(opts) {
  opts.root.walkRules(rule => {
    if (!isStandardSyntaxRule(rule)) {
      return;
    }
    // Check each selector individually, instead of all as one string,
    // in case some that aren't the first begin with combinators (nesting syntax)
    const fixedSelectors = rule.selectors.map(selector => {
      return parseSelector(selector, opts.result, rule, selectorTree => {
        selectorTree.walkCombinators(node => {
          // Ignore spaced descendant combinator
          if (/\s/.test(node.value)) {
            return;
          }

          const parentParentNode = node.parent && node.parent.parent;

          // Ignore pseudo-classes selector like `.foo:nth-child(2n + 1) {}`
          if (parentParentNode && parentParentNode.type === "pseudo") {
            return;
          }

          const sourceIndex = node.sourceIndex;
          const index =
            node.value.length > 1 && opts.locationType === "before"
              ? sourceIndex
              : sourceIndex + node.value.length - 1;

          check(selector, node, index, rule, sourceIndex);
        });
      });
    });
    if (
      opts.fix &&
      fixedSelectors.some((fixed, i) => rule.selectors[i] !== fixed)
    ) {
      rule.selectors = fixedSelectors;
    }
  });

  function check(source, combinator, index, node, sourceIndex) {
    opts.locationChecker({
      source,
      index,
      errTarget: combinator.value,
      err: m => {
        if (opts.fix && opts.fix(combinator)) {
          return;
        }
        report({
          message: m,
          node,
          index: sourceIndex,
          result: opts.result,
          ruleName: opts.checkedRuleName
        });
      }
    });
  }
};
