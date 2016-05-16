import execall from "execall"
import {
  blurComments,
  blurFunctionArguments,
  hasBlock,
  beforeBlockString,
  report,
  ruleMessages,
  validateOptions,
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
      check(decl.toString(), decl)
    })

    root.walkAtRules(atRule => {

      // Ignore @imports
      if (atRule.name.toLowerCase() === "import") { return }

      const source = (hasBlock(atRule))
        ? beforeBlockString(atRule, { noRawBefore: true })
        : atRule.toString()
      check(source, atRule)
    })

    function check(source, node) {
      // Get out quickly if there are no periods
      if (source.indexOf(".") === -1) { return }

      const sanitizedSource = blurComments(blurFunctionArguments(source, "url"))
      const errors = execall(/\.\d*0+(?:\D|$)/g, sanitizedSource)
      if (!errors.length) { return }

      errors.forEach(error => {
        report({
          message: messages.rejected,
          node,
          index: error.index + error.match.length - 2,
          result,
          ruleName,
        })
      })
    }
  }
}
