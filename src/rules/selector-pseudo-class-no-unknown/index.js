import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  optionsHaveIgnoredPseudoClass,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  pseudoClasses,
  pseudoElements,
} from "../../reference/keywordSets"
import { isString } from "lodash"
import { vendor } from "postcss"

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
      const { selector } = rule

      // Return early before parse if no pseudos for performance
      if (selector.indexOf(":") === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const { value } = pseudoNode

          if (!isStandardSyntaxSelector(value)) { return }

          // Ignore pseudo-elements
          if (value.slice(0, 2) === "::") { return }

          if (optionsHaveIgnoredPseudoClass(options, pseudoNode)) { return }

          const name = value.slice(1)

          if (
            vendor.prefix(name)
            || pseudoClasses.has(name.toLowerCase())
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
