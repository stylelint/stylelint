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

    root.walkRules(rule => {
      // Ignore keyframe selectors
      if (rule.parent.type === "atrule" && rule.parent.name === "keyframes") {
        return
      }

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
          if (tag.value === "&") { return }

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
