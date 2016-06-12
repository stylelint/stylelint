import { isString } from "lodash"
import { vendor } from "postcss"
import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  pseudoClasses,
  pseudoElements,
} from "../../reference/keywordSets"

export const ruleName = "selector-pseudo-class-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected unknown pseudo-class selector "${selector}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignorePseudoClasses: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const selector = rule.selector

      if (selector.indexOf(":") === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const pseudoClass = pseudoNode.value

          if (!isStandardSyntaxSelector(pseudoClass)) { return }

          // Ignore pseudo-elements
          if (pseudoClass.indexOf("::") !== -1) { return }

          const pseudoClassName = pseudoClass.replace(/:+/, "")

          if (vendor.prefix(pseudoClassName)
            || pseudoClasses.has(pseudoClassName.toLowerCase())
            || pseudoElements.has(pseudoClassName.toLowerCase())
          ) { return }

          const ignorePseudoElements = options && options.ignorePseudoClasses || []

          if (ignorePseudoElements.indexOf(pseudoClassName.toLowerCase()) !== -1) { return }

          report({
            message: messages.rejected(pseudoClass),
            node: rule,
            index: pseudoNode.sourceIndex,
            ruleName,
            result,
          })
        })
      })
    })
  }
}
