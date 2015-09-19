import {
  isAutoprefixable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "property-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed property "${p}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const prop = decl.prop

      // Make sure there's a vendor prefix,
      // but this isn't a custom property
      if (prop[0] !== "-" || prop[1] === "-") { return }

      if (isAutoprefixable.property(prop)) {
        report({
          message: messages.rejected(prop),
          node: decl,
          result,
          ruleName,
        })
      }
    })
  }
}
