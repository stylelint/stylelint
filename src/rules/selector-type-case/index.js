import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
  cssRuleIsKeyframe,
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

      if (
        cssRuleHasSelectorEndingWithColon(rule)
        || cssRuleIsKeyframe(rule)
      ) { return }

      function checkSelector(selectorAST) {
        selectorAST.eachTag(tag => {
          // Destructring the tag object
          const { parent, sourceIndex, value } = tag

          // postcss-selector-parser includes the arguments to nth-child() functions
          // as "tags", so we need to ignore them ourselves.
          // The fake-tag's "parent" is actually a selector node, whose parent
          // should be the :nth-child pseudo node.
          if (parent.parent.type === "pseudo" && parent.parent.value === ":nth-child") {
            return
          }

          // & is not a type selector: it's used for nesting
          if (value[0] === "&") { return }

          const expectedValue = expectation === "lower" ? value.toLowerCase() : value.toUpperCase()

          if (value === expectedValue) { return }

          report({
            message: messages.expected(value, expectedValue),
            node: rule,
            index: sourceIndex,
            ruleName,
            result,
          })
        })
      }

      selectorParser(checkSelector).process(rule.selector)
    })
  }
}
