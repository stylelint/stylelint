import selectorParser from "postcss-selector-parser"
import { get } from "lodash"
import {
  cssRuleIsKeyframe,
  isStandardRule,
  isStandardTypeSelector,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-type"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected type selector",
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: on }, {
      actual: options,
      possible: {
        ignore: [ "descendant", "compounded" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isStandardRule(rule)) { return }
      if (cssRuleIsKeyframe(rule)) { return }

      selectorParser(checkSelector).process(rule.selector)

      function checkSelector(selectorAST) {
        selectorAST.eachTag(tag => {

          if (!isStandardTypeSelector(tag)) { return }

          if (optionsHaveIgnored(options, "descendant") && isCombinator(tag.prev())) {
            return
          }

          if (
            optionsHaveIgnored(options, "compounded")
            && get(tag, "parent.nodes.length") > 1
            && !isCombinator(tag.prev())
            && !isCombinator(tag.next())
          ) {
            return
          }

          report({
            message: messages.rejected,
            node: rule,
            index: tag.sourceIndex,
            ruleName,
            result,
          })
        })
      }
    })
  }
}

function isCombinator(node) {
  return get(node, "type") === "combinator"
}
