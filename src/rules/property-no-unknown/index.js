import { isCustomProperty, isStandardSyntaxDeclaration, isStandardSyntaxProperty, optionsMatches, report, ruleMessages, validateOptions } from "../../utils"
import _ from "lodash"
import { all as properties } from "known-css-properties"
import { vendor } from "postcss"

export const ruleName = "property-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected unknown property "${property}"`,
})

export default function (actual, options) {
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

      if (!shouldCheckPrefixed && vendor.prefix(prop)) {
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
