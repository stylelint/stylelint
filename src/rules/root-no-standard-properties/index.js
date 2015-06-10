import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected standard property "${p}" in rule set applied to ":root"`,
})

export default function () {
  return function (css, result) {
    css.eachRule(function (rule) {
      if (rule.selector.indexOf(":root") === -1) { return }

      rule.eachDecl(function (decl) {
        const prop = decl.prop

        if (prop.indexOf("--") !== 0) {
          report({
            message: messages.rejected(prop),
            node: decl,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
