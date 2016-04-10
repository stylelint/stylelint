import selectorParser from "postcss-selector-parser"
import { get } from "lodash"
import {
  cssRuleHasSelectorEndingWithColon,
  cssRuleIsKeyframe,
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

      if (
        cssRuleHasSelectorEndingWithColon(rule)
        || cssRuleIsKeyframe(rule)
      ) { return }

      selectorParser(checkSelector).process(rule.selector)

      function checkSelector(selectorAST) {
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

          if (optionsHaveIgnored(options, "descendant")  && isCombinator(tag.prev())) {
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
