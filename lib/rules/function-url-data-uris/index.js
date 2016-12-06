"use strict"

const isStandardSyntaxValue = require("../../utils/isStandardSyntaxValue")
const isVariable = require("../../utils/isVariable")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const valueParser = require("postcss-value-parser")

const ruleName = "function-url-data-uris"

const messages = ruleMessages(ruleName, {
  expected: "Expected a data URI",
  rejected: "Unexpected data URI",
})

const rule = function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(function (decl) {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function" || valueNode.value.toLowerCase() !== "url" || !valueNode.nodes.length > 0) {
          return
        }

        const urlValueNode = valueNode.nodes[0]

        if (!urlValueNode.value || !isStandardSyntaxValue(urlValueNode.value) || isVariable(urlValueNode.value)) {
          return
        }

        const valueContainDataUris = urlValueNode.value.toLowerCase().indexOf("data:") === 0
        const needUrlDataUris = expectation === "always"

        if (valueContainDataUris && needUrlDataUris || !valueContainDataUris && !needUrlDataUris) {
          return
        }

        const message = needUrlDataUris ? messages.expected : messages.rejected

        report({
          message,
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
