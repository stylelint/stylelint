const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const shorthandData = require("../../reference/shorthandData")

export const ruleName = "declaration-block-no-shorthand-property-overrides"

export const messages = ruleMessages(ruleName, {
  rejected: (shorthand, original) => `Unexpected shorthand "${shorthand}" after "${original}"`,
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      const declarations = {}
      // Shallow iteration so nesting doesn't produce
      // false positives
      statement.each(node => {
        if (node.type !== "decl") {
          return
        }
        const prop = node.prop

        const overrideables = shorthandData[prop.toLowerCase()]
        if (!overrideables) {
          declarations[prop.toLowerCase()] = prop
          return
        }
        overrideables.forEach(longhandProp => {
          if (!declarations.hasOwnProperty(longhandProp)) {
            return
          }
          report({
            ruleName,
            result,
            node,
            message: messages.rejected(prop, declarations[longhandProp]),
          })
        })
      })
    }
  }
}
