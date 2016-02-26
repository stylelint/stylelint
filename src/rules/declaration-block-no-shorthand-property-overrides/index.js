import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import shorthands from "./shorthands"

export const ruleName = "declaration-block-no-shorthand-property-overrides"

export const messages = ruleMessages(ruleName, {
  rejected: (shorthand, original) => (
    `Unexpected shorthand "${shorthand}" after "${original}"`
  ),
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      const declarations = new Set()
      // Shallow iteration so nesting doesn't produce
      // false positives
      statement.each(node => {
        if (node.type !== "decl") { return }
        const { prop } = node
        const overrideables = shorthands[prop]
        if (!overrideables) {
          declarations.add(prop)
          return
        }
        overrideables.forEach(longhandProp => {
          if (declarations.has(longhandProp)) {
            report({
              ruleName,
              result,
              node,
              message: messages.rejected(prop, longhandProp),
            })
          }
        })
      })
    }
  }
}
