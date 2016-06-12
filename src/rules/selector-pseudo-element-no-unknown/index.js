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
import { pseudoElements } from "../../reference/keywordSets"

export const ruleName = "selector-pseudo-element-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected unknown pseudo-element selector "${selector}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignorePseudoElements: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      const selector = rule.selector

      if (selector.indexOf("::") === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const pseudoElement = pseudoNode.value

          if (!isStandardSyntaxSelector(pseudoElement)) { return }

          // Ignore pseudo-classes
          if (pseudoElement.indexOf("::") === -1) { return }

          const pseudoElementName = pseudoElement.replace(/:+/, "")

          if (vendor.prefix(pseudoElementName) || pseudoElements.has(pseudoElementName.toLowerCase())) { return }

          const ignorePseudoElements = options && options.ignorePseudoElements || []

          if (ignorePseudoElements.indexOf(pseudoElementName.toLowerCase()) !== -1) { return }

          report({
            message: messages.rejected(pseudoElement),
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
