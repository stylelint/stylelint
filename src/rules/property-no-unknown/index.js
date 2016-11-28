const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
import { all as properties } from "known-css-properties"
const postcss = require("postcss")

export const ruleName = "property-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected unknown property "${property}"`,
})

module.exports = function (actual, options) {
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
