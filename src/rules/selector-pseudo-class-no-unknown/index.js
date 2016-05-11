import { isString } from "lodash"
import selectorParser from "postcss-selector-parser"
import { vendor } from "postcss"
import {
  isKnownPseudoClass,
  isKnownPseudoElement,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-pseudo-class-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (u) => `Unexpected unknown pseudo-class selector "${u}"`,
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
      const selector = rule.selector

      if (selector.indexOf(":") === -1) { return }

      selectorParser(selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const pseudoClass = pseudoNode.value

          // Ignore pseudo-elements
          if (pseudoClass.indexOf("::") !== -1) { return }

          const pseudoClassName = pseudoClass.replace(/:+/, "")

          if (vendor.prefix(pseudoClassName)
            || isKnownPseudoClass(pseudoClassName)
            || isKnownPseudoElement(pseudoClassName)
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
      }).process(selector)
    })
  }
}
