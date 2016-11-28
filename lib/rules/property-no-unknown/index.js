"use strict"

const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const properties = require("known-css-properties").all
const postcss = require("postcss")

const ruleName = "property-no-unknown"

const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected unknown property "${property}"`,
})

const rule = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreProperties: [_.isString],
        checkPrefixed: _.isBoolean,
      },
      optional: true,
    })

    if (!validOptions) {
      return
    }

    const shouldCheckPrefixed = _.get(options, "checkPrefixed")

    root.walkDecls(decl => {
      const prop = decl.prop

      if (!isStandardSyntaxProperty(prop)) {
        return
      }
      if (!isStandardSyntaxDeclaration(decl)) {
        return
      }
      if (isCustomProperty(prop)) {
        return
      }

      if (!shouldCheckPrefixed && postcss.vendor.prefix(prop)) {
        return
      }

      if (optionsMatches(options, "ignoreProperties", prop)) {
        return
      }

      if (properties.indexOf(prop.toLowerCase()) !== -1) {
        return
      }

      report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
