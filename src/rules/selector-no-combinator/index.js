import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-combinator"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected combinator",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkCombinators(combinator => {
          report({
            message: messages.rejected,
            node: rule,
            index: combinator.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}
