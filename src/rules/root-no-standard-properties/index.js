const isCustomProperty = require("../../utils/isCustomProperty")
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty")
const parseSelector = require("../../utils/parseSelector")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected standard property "${property}"`,
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    root.walkRules(rule => {
      if (rule.selector.toLowerCase().indexOf(":root") === -1) {
        return
      }
      parseSelector(rule.selector, result, rule, checkSelector)

      function checkSelector(selectorAST) {
        if (ignoreRule(selectorAST)) {
          return
        }

        rule.each(function (node) {
          if (node.type !== "decl") {
            return
          }

          const prop = node.prop

          if (!isStandardSyntaxProperty(prop)) {
            return
          }
          if (isCustomProperty(prop)) {
            return
          }

          report({
            message: messages.rejected(prop),
            node,
            result,
            ruleName,
          })
        })
      }
    })
  }
}

function ignoreRule(selectorAST) {
  let ignore = false
  selectorAST.walk(selectorNode => {
    // ignore `:root` selector inside a `:not()` selector
    if (selectorNode.value && selectorNode.value.toLowerCase() === ":root" && selectorNode.parent.parent.value && selectorNode.parent.parent.value.toLowerCase() === ":not") {
      ignore = true
    }
  })
  return ignore
}
