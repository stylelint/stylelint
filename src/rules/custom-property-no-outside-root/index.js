import {
  ruleMessages
} from "../../utils"

export const ruleName = "custom-property-no-outside-root"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected custom property outside root",
})

export default function () {
  return (root, result) => {
    root.eachRule(rule => {
      // Ignore rules whose selector is just `:root`
      if (rule.selector.trim() === ":root") { return }

      rule.eachDecl(decl => {
        if (decl.prop.substr(0, 2) === "--") {
          result.warn(messages.rejected, { node: decl })
        }
      })
    })
  }
}
