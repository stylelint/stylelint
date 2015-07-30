import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "selector-no-type"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected type selector",
})

export default function (o) {
  return (root, result) => {
    validateOptions({ ruleName, result, actual: o })

    root.eachRule(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachTag(() => {
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
