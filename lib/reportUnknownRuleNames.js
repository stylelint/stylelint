"use strict";

const levenshteinDistance = require("./utils/levenshteinDistance");
const rules = require("./rules");

const MAX_LEVENSHTEIN_DISTANCE = 6;

function extractSuggestions(ruleName) {
  const suggestions = new Array(MAX_LEVENSHTEIN_DISTANCE);

  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i] = [];
  }

  rules.forEach(existRuleName => {
    const distance = levenshteinDistance(
      existRuleName,
      ruleName,
      MAX_LEVENSHTEIN_DISTANCE
    );

    if (distance > 0) {
      suggestions[distance - 1].push(existRuleName);
    }
  });

  let result = [];

  for (let i = 0; i < suggestions.length; i++) {
    if (suggestions[i].length > 0) {
      if (i < 3) {
        return suggestions[i].slice(0, 3);
      }

      result = result.concat(suggestions[i]);
    }
  }

  return result.slice(0, 3);
}

function rejectMessage(ruleName, suggestions = []) {
  return (
    `Unknown rule ${ruleName}.` +
    (suggestions.length > 0
      ? ` May be you mean ${suggestions.join(", ")}.`
      : "")
  );
}

const cache = new Map();

module.exports = function reportUnknownRuleNames(
  unknownRules,
  postcssRoot,
  postcssResult
) {
  unknownRules.forEach(ruleName => {
    const suggestions = cache.has(ruleName)
      ? cache.get(ruleName)
      : extractSuggestions(ruleName);
    const warningProperties /*: Object*/ = {
      severity: "error",
      rule: ruleName,
      node: postcssRoot,
      index: 0
    };

    cache.set(ruleName, suggestions);
    postcssResult.warn(rejectMessage(ruleName, suggestions), warningProperties);
  });
};
