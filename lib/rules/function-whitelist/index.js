"use strict"

const declarationValueIndex = require("../../utils/declarationValueIndex")
const isStandardSyntaxFunction = require("../../utils/isStandardSyntaxFunction")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const valueParser = require("postcss-value-parser")
const postcss = require("postcss")

const ruleName = "function-whitelist"

const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected function "${name}"`,
})

const rule = function (whitelistInput) {
  const whitelist = [].concat(whitelistInput)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isString],
    })
    if (!validOptions) {
      return
    }
    root.walkDecls(decl => {
      const value = decl.value

      valueParser(value).walk(function (node) {
        if (node.type !== "function") {
          return
        }
        if (!isStandardSyntaxFunction(node)) {
          return
        }
        if (matchesStringOrRegExp(postcss.vendor.unprefixed(node.value).toLowerCase(), whitelist)) {
          return
        }
        report({
          message: messages.rejected(node.value),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
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
