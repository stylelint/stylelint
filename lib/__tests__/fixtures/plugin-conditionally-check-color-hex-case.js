"use strict";

const stylelint = require("../../");

const ruleName = "plugin/conditionally-check-color-hex-case";

module.exports = stylelint.createPlugin(ruleName, function(
  expectation,
  options,
  context
) {
  const colorHexCaseRule = stylelint.rules["color-hex-case"](
    expectation,
    options,
    context
  );

  return (root, result) => {
    if (root.toString().indexOf("@@check-color-hex-case") === -1) return;

    colorHexCaseRule(root, result);
  };
});
