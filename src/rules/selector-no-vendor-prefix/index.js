import selectorParser from "postcss-selector-parser"
import {
  isStandardRule,
  isStandardSelector,
  report,
  ruleMessages,
  isAutoprefixable,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed selector "${p}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSelector(selector)) { return }
      selectorParser(selectorTree => {
        selectorTree.eachPseudo(pseudoNode => {
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
      }).process(selector)
    })
  }
}
