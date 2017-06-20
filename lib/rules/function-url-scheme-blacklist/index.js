"use strict"

const _ = require("lodash")
const functionArgumentsSearch = require("../../utils/functionArgumentsSearch")
const isStandardSyntaxUrl = require("../../utils/isStandardSyntaxUrl")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const parse = require("url").parse
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

const ruleName = "function-url-scheme-blacklist"

const messages = ruleMessages(ruleName, {
  rejected: scheme => `Unexpected URL scheme "${scheme}:"`,
})

const rule = function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
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

        if (!matchesStringOrRegExp(scheme.toLowerCase(), blacklist)) {
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

rule.primaryOptionArray = true

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
