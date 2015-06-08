import {
  ruleMessages
} from "../../utils"

export const ruleName = "custom-property-pattern"

export const messages = ruleMessages(ruleName, {
  rejected: "Custom property name does not match specified pattern",
})

/**
 * @param {regexp} pattern
 */
export default function (pattern) {
  return (root, result) => {
    root.eachDecl(decl => {
      const prop = decl.prop
      if (prop.slice(0, 2) !== "--") { return }

      if (!pattern.test(prop.slice(2))) {
        result.warn(messages.rejected, { node: decl })
      }
    })
  }
}
