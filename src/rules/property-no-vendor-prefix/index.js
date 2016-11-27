const isAutoprefixable = require("../../utils/isAutoprefixable")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "property-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected vendor-prefix "${property}"`,
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkDecls(decl => {
      const prop = decl.prop

      // Make sure there's a vendor prefix,
      // but this isn't a custom property

      if (prop[0] !== "-" || prop[1] === "-") {
        return
      }

      if (!isAutoprefixable.property(prop)) {
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
