import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "selector-no-attribute"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected attribute selector",
})

export default function () {
  return (root, result) => {
    root.eachRule(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachAttribute(() => {
          report({
            message: messages.rejected,
            node: rule,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
