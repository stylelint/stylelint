import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "selector-no-universal"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected universal selector",
})

export default function () {
  return (css, result) => {
    css.eachRule(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachUniversal(() => {
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
