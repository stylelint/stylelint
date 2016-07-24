import {
  isStandardSyntaxSelector,
  matchesStringOrRegExp,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
import { vendor } from "postcss"

export const ruleName = "selector-pseudo-class-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Unexpected pseudo-class "${selector}"`,
})

function rule(blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const { selector } = rule

      if (!isStandardSyntaxSelector(selector)) { return }
      if (selector.indexOf(":") === -1) { return }

      parseSelector(selector, result, rule, selectorTree => {
        selectorTree.walkPseudos(pseudoNode => {
          const { value } = pseudoNode

          // Ignore pseudo-elements
          if (value.slice(0, 2) === "::") { return }

          const name = value.slice(1)

          if (!matchesStringOrRegExp(vendor.unprefixed(name).toLowerCase(), blacklist)) { return }

          report({
            index: pseudoNode.sourceIndex,
            message: messages.rejected(name),
            node: rule,
            result,
            ruleName,
          })
        })
      })
    })
  }
}

rule.primaryOptionArray = true

export default rule
