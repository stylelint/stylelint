import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

const RE_VALID_CSS_PROPERTY = /^[a-z-]+$/

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

        if (!RE_VALID_CSS_PROPERTY.test(prop)) { return }

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
