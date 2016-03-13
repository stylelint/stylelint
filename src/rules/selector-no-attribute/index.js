import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
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
      if (cssRuleHasSelectorEndingWithColon(rule)) { return }
      selectorParser(selectorAST => {
        selectorAST.eachAttribute(attribute => {
          report({
            message: messages.rejected,
            node: rule,
            index: attribute.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
