import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "selector-no-combinator"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected combinator",
})

export default function () {
  return (root, result) => {
    root.eachRule(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachCombinator(() => {
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
