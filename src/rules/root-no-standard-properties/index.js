import {
  report,
  ruleMessages,
  cssWordIsVariable,
  validateOptions,
} from "../../utils"

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected standard property "${p}" applied to ":root"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (rule.selector.indexOf(":root") === -1) { return }

      rule.walkDecls(function (decl) {
        const prop = decl.prop

        if (cssWordIsVariable(prop)) { return }

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
