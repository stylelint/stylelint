import {
  isStandardRule,
  isStandardSelector,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-universal"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected universal selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSelector(selector)) { return }
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkUniversals(universal => {
          report({
            message: messages.rejected,
            node: rule,
            index: universal.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}
