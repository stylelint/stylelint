"use strict"

const functionArgumentsSearch = require("../../utils/functionArgumentsSearch")
const isStandardSyntaxUrl = require("../../utils/isStandardSyntaxUrl")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")

const ruleName = "function-url-no-scheme-relative"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected scheme-relative url",
})

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkDecls(function (decl) {
      functionArgumentsSearch(decl.toString().toLowerCase(), "url", (args, index) => {
        const url = _.trim(args, " '\"")

        if (!isStandardSyntaxUrl(url) || url.indexOf("//") !== 0) {
          return
        }

        report({
          message: messages.rejected,
          node: decl,
          index,
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
