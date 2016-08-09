import {
  isStandardSyntaxRule,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { nonSpaceCombinators } from "../../reference/punctuationSets"

export const ruleName = "selector-descendant-combinator-no-non-space"

export const messages = ruleMessages(ruleName, {
  rejected: nonSpaceCharacter => `Unexpected "${nonSpaceCharacter}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }

      const { selector } = rule

      parseSelector(selector, result, rule, fullSelector => {
        fullSelector.walkCombinators(combinatorNode => {
          const { value } = combinatorNode

          if (nonSpaceCombinators.has(value)) { return }
          if (value === " ") { return }

          report({
            result,
            ruleName,
            message: messages.rejected(value),
            node: rule,
            index: combinatorNode.sourceIndex,
          })
        })
      })
    })
  }
}
