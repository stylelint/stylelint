import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-type-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      // Ignore keyframe selectors
      if (rule.parent.type === "atrule" && rule.parent.name === "keyframes") {
        return
      }

      if (cssRuleHasSelectorEndingWithColon(rule)) { return }

      selectorParser(selectorAST => {
        selectorAST.eachTag(tag => {
          // postcss-selector-parser includes the arguments to nth-child() functions
          // as "tags", so we need to ignore them ourselves.
          // The fake-tag's "parent" is actually a selector node, whose parent
          // should be the :nth-child pseudo node.
          if (tag.parent.parent.type === "pseudo" && tag.parent.parent.value === ":nth-child") {
            return
          }

          // & is not a type selector: it's used for nesting 
          if (tag.value[0] === "&") { return }

          const typeValue = tag.value
          const typeValueLower = typeValue.toLowerCase()
          const typeValueUpper = typeValue.toUpperCase()
          const expectedValue = expectation === "lower" ? typeValueLower : typeValueUpper

          if (typeValue === expectedValue) { return }

          report({
            message: messages.expected(typeValue, expectedValue),
            node: rule,
            index: tag.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
