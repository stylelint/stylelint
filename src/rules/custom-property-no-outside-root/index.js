import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "custom-property-no-outside-root"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected custom property",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      // Ignore rules whose selector is just `:root`
      if (rule.selector.toLowerCase().trim() === ":root") { return }

      rule.walkDecls(decl => {
        if (decl.prop.substr(0, 2) !== "--") { return }
        report({
          message: messages.rejected,
          node: decl,
          result,
          ruleName,
        })
      })
    })
  }
}
