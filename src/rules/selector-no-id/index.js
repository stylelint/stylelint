import {
  isKeyframeRule,
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
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
      if (!isStandardSyntaxRule(rule)) { return }
      if (isKeyframeRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkIds(idNode => {

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
    })
  }
}
