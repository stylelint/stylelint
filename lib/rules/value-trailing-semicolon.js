"use strict";

module.exports = function valueTrailingSemicolon() {
  return function(css, result) {
    css.eachRule(function(rule) {
      if (rule.semicolon) {
        return;
      }
      result.warn(
        "Expected a trailing semicolon (value-trailing-semicolon)",
        {node: rule}
      );
    });
  };
};
