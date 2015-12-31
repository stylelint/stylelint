import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-id"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected id selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachId(id => {
          if (id.value[0] === "{" && id.value.slice(-1) === "}") { return }
          report({
            message: messages.rejected,
            node: rule,
            index: id.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
