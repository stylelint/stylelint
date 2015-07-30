import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "selector-no-universal"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected universal selector",
})

export default function (o) {
  return (root, result) => {
    validateOptions({ ruleName, result, actual: o })

    root.eachRule(rule => {
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
