import {
  isStandardSyntaxRule,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-attribute"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected attribute selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const { selector } = rule
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkAttributes(attribute => {
          report({
            message: messages.rejected,
            node: rule,
            index: attribute.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}
