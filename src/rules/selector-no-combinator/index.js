import selectorParser from "postcss-selector-parser"
import {
  isStandardRule,
  isStandardSelector,
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
      if (!isStandardRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSelector(selector)) { return }
      selectorParser(selectorAST => {
        selectorAST.eachCombinator(combinator => {
          report({
            message: messages.rejected,
            node: rule,
            index: combinator.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(selector)
    })
  }
}
