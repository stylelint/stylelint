import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
  cssRuleIsKeyframe,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-id"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected id selector",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (
        cssRuleHasSelectorEndingWithColon(rule)
        || cssRuleIsKeyframe(rule)
      ) { return }
      selectorParser(selectorAST => {
        selectorAST.eachId(idNode => {
          // Ignore Sass intepolation possibilities
          if (/#{.+}/.test(idNode.toString())) { return }
          if (idNode.parent.parent.type === "pseudo") { return }

          report({
            message: messages.rejected,
            node: rule,
            index: idNode.sourceIndex,
            ruleName,
            result,
          })
        })
      })
        .process(rule.selector)
    })
  }
}
