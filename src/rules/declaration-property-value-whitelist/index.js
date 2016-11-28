const _ = require("lodash")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const postcss = require("postcss")

export const ruleName = "declaration-property-value-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: (property, value) => `Unexpected value "${value}" for property "${property}"`,
})

module.exports = function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isObject],
    })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop,
        value = decl.value

      const unprefixedProp = postcss.vendor.unprefixed(prop)
      const propWhitelist = _.find(whitelist, (list, propIdentifier) => matchesStringOrRegExp(unprefixedProp, propIdentifier))

      if (_.isEmpty(propWhitelist)) {
        return
      }

      if (matchesStringOrRegExp(value, propWhitelist)) {
        return
      }

      report({
        message: messages.rejected(prop, value),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
