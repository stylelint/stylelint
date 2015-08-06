import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected standard property "${p}" applied to ":root"`,
})

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: o,
      possible: [],
    })
    if (!validOptions) { return }

    root.eachRule(rule => {
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
