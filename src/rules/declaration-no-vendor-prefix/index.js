import autoprefixer from "autoprefixer-core"
import { ruleMessages } from "../../utils"

const prefix = autoprefixer({ add: false, browsers: [] })

export const ruleName = "declaration-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor prefix "${p}"`,
})

export default function () {
  return function (css, result) {
    css.eachRule(function (rule) {
      let containsPrefixes = false

      rule.eachDecl(function (decl) {
        if (decl.prop[0] === "-" || decl.value[0] === "-") {
          containsPrefixes = true
          return false
        }
      })

      if (!containsPrefixes) { return }

      const prefixedRule = prefix.process(rule).root.first
      const prefixedProps = []
      const prefixedValues = []
      prefixedRule.eachDecl(function (decl) {
        prefixedProps.push(decl.prop)
        prefixedValues.push(decl.value)
      })

      rule.eachDecl(function (decl) {
        if (prefixedProps.indexOf(decl.prop) === -1) {
          result.warn(messages.rejected(decl.prop), { node: decl })
        }
        if (prefixedValues.indexOf(decl.value) === -1) {
          result.warn(messages.rejected(decl.value), { node: decl })
        }
      })
    })
  }
}
