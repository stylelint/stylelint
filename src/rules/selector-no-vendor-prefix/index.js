import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
  report,
  ruleMessages,
  isAutoprefixable,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: selector => `Unexpected vendor-prefix "${selector}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }
      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          if (isAutoprefixable.selector(pseudoNode.value)) {
            report({
              result,
              ruleName,
              message: messages.rejected(pseudoNode.value),
              node: rule,
              index: rule.raws.before.length + pseudoNode.sourceIndex,
            })
          }
        })
      })
    })
  }
}
