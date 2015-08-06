import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "custom-property-no-outside-root"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected custom property outside root`,
})

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: o,
      possible: [],
    })
    if (!validOptions) { return }

    root.eachRule(rule => {
      // Ignore rules whose selector is just `:root`
      if (rule.selector.trim() === ":root") { return }

      rule.eachDecl(decl => {
        if (decl.prop.substr(0, 2) === "--") {
          report({
            message: messages.rejected,
            node: decl,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
