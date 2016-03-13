import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
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
      if (cssRuleHasSelectorEndingWithColon(rule)) { return }
      selectorParser(selectorAST => {
        selectorAST.eachUniversal(universal => {
          report({
            message: messages.rejected,
            node: rule,
            index: universal.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
