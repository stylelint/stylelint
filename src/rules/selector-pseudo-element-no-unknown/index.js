import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  optionsHaveIgnoredPseudoElement,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import { pseudoElements } from "../../reference/keywordSets"
import { vendor } from "postcss"

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
      const { selector } = rule

      // Return early before parse if no pseudos for performance
      if (selector.indexOf(":") === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const { value } = pseudoNode

          if (!isStandardSyntaxSelector(value)) { return }

          // Ignore pseudo-classes
          if (value.slice(0, 2) !== "::") { return }

          if (optionsHaveIgnoredPseudoElement(options, pseudoNode)) { return }

          const name = value.slice(2)

          if (
            vendor.prefix(name)
            || pseudoElements.has(name.toLowerCase())
          ) { return }

          report({
            message: messages.rejected(value),
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
