import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "rule-no-duplicate-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected duplicate property "${p}"`,
})

export default function () {
  return (root, result) => {
    root.eachRule(rule => {
      var decls = []
      rule.eachDecl(function (decl) {
        const prop = decl.prop
        if (decls.indexOf(prop) !== -1) {
          report({
            message: messages.rejected(prop),
            node: decl,
            result,
            ruleName,
          })
        }
        decls.push(prop)
      })
    })
  }
}
