import {
  atRuleParamIndex,
  declarationValueIndex,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import valueParser from "postcss-value-parser"

export const ruleName = "number-no-trailing-zeros"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected trailing zero(s)",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      if (atRule.name.toLowerCase() === "import") { return }

      check(atRule, atRule.params, atRuleParamIndex)
    })

    root.walkDecls(decl =>
      check(decl, decl.value, declarationValueIndex)
    )

    function check(node, value, getIndex) {
      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) { return }

      valueParser(value).walk(valueNode => {
        // Ignore `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") { return false }

        // Ignore strings, comments, etc
        if (valueNode.type !== "word") { return }

        const match = /(\.\d*)0+(?:\D|$)/.exec(valueNode.value)

        if (match === null) { return }

        report({
          message: messages.rejected,
          node,
          index: getIndex(node) + valueNode.sourceIndex + match.index + match[1].length,
          result,
          ruleName,
        })
      })
    }
  }
}
