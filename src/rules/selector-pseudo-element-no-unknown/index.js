import { isString } from "lodash"
import selectorParser from "postcss-selector-parser"
import { vendor } from "postcss"
import {
  isKnownPseudoElement,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-element-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (u) => `Unexpected unknown pseudo-element selector "${u}"`,
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
      const selector = rule.selector

      if (selector.indexOf("::") === -1) { return }

      selectorParser(selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const pseudoElement = pseudoNode.value

          // Ignore pseudo-classes
          if (pseudoElement.indexOf("::") === -1) { return }

          const pseudoElementName = pseudoElement.replace(/:+/, "")

          if (vendor.prefix(pseudoElementName) || isKnownPseudoElement(pseudoElementName)) { return }

          const ignorePseudoElements = options && options.ignorePseudoElements || []

          if (ignorePseudoElements.indexOf(pseudoElementName) !== -1) { return }

          report({
            message: messages.rejected(pseudoElement),
            node: rule,
            index: pseudoNode.sourceIndex,
            ruleName,
            result,
          })
        })
      }).process(selector)
    })
  }
}
