"use strict"

const stylelint = require("../../")

const ruleName = "plugin/conditionally-check-color-hex-case"

module.exports = stylelint.createPlugin(ruleName, function (expectation) {
  const colorHexCaseRule = stylelint.rules["color-hex-case"](expectation)
  return (root, result) => {
    if (root.toString().indexOf("@@check-color-hex-case") === -1) return
    colorHexCaseRule(root, result)
  }
})
