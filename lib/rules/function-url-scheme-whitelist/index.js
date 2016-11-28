"use strict"

const containsString = require("../../utils/containsString")
const functionArgumentsSearch = require("../../utils/functionArgumentsSearch")
const isStandardSyntaxUrl = require("../../utils/isStandardSyntaxUrl")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const parse = require("url").parse

const ruleName = "function-url-scheme-whitelist"

const messages = ruleMessages(ruleName, {
  rejected: scheme => `Unexpected url scheme "${scheme}:"`,
})

const rule = function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isString],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(function (decl) {
      functionArgumentsSearch(decl.toString().toLowerCase(), "url", (args, index) => {
        const unspacedUrlString = _.trim(args, " ")
        if (!isStandardSyntaxUrl(unspacedUrlString)) {
          return
        }
        const urlString = _.trim(unspacedUrlString, "'\"")

        const url = parse(urlString)
        if (url.protocol === null) {
          return
        }

        const scheme = url.protocol.toLowerCase().slice(0, -1) // strip trailing `:`

        // The URL spec does not require a scheme to be followed by `//`, but checking
        // for it allows this rule to differentiate <scheme>:<hostname> urls from
        // <hostname>:<port> urls. `data:` scheme urls are an exception to this rule.
        const slashIndex = url.protocol.length
        const expectedSlashes = urlString.slice(slashIndex, slashIndex + 2)
        const isSchemeLessUrl = expectedSlashes !== "//" && scheme !== "data"
        if (isSchemeLessUrl) {
          return
        }

        const whitelistLowerCase = typeof whitelist === "string" ? whitelist.toLowerCase() : whitelist.join("|").toLowerCase().split("|")

        if (containsString(scheme, whitelistLowerCase)) {
          return
        }

        report({
          message: messages.rejected(scheme),
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
