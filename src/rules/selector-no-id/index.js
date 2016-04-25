import selectorParser from "postcss-selector-parser"
import {
  isStandardRule,
  cssRuleIsKeyframe,
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
      if (!isStandardRule(rule)) { return }
      if (cssRuleIsKeyframe(rule)) { return }
      selectorParser(selectorAST => {
        selectorAST.eachId(idNode => {

          if (idNode.parent.parent.type === "pseudo") { return }

          report({
            message: messages.rejected,
            node: rule,
            index: idNode.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
