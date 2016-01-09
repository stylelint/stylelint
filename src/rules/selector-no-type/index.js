import selectorParser from "postcss-selector-parser"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-type"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected type selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }
    // Nesting, nth-child, and keyframes
    const exclusions = ["&", "n", "to", "from"]
    root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.eachTag(tag => {
          // Check if in exclusions
          if (exclusions.indexOf(tag.value) !== -1) { return }
          // Also check if starts with a digit, for nth-child(3n) and %s in keyframes
          if (!isNaN(tag.value.charAt(0))) { return }
          report({
            message: messages.rejected,
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
