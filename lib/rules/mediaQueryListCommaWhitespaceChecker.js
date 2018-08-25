"use strict";

const atRuleParamIndex = require("../utils/atRuleParamIndex");
const report = require("../utils/report");
const styleSearch = require("style-search");

module.exports = function(opts) {
  opts.root.walkAtRules(/^media$/i, atRule => {
    const params = atRule.raws.params ? atRule.raws.params.raw : atRule.params;
    styleSearch({ source: params, target: "," }, match => {
      checkComma(params, match.startIndex, atRule);
    });
  });

  function checkComma(source, index, node) {
    opts.locationChecker({
      source,
      index,
      err: m => {
        const commaIndex = index + atRuleParamIndex(node);
        if (opts.fix && opts.fix(node, commaIndex)) {
          return;
        }
        report({
          message: m,
          node,
          index: commaIndex,
          result: opts.result,
          ruleName: opts.checkedRuleName
        });
      }
    });
  }
};
