import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "number-no-trailing-zeros"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected trailing zero(s)",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      check(decl.value, decl)
    })

    root.walkAtRules(atRule => {
      check(atRule.params, atRule)
    })

    function check(source, node) {
      // Get out quickly if there are no periods
      if (source.indexOf(".") === -1) { return }

      if (/\.\d*0+(?:\D|$)/g.test(source)) {
        report({
          message: messages.rejected,
          node,
          result,
          ruleName,
        })
      }
    }
  }
}
