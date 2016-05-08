import selectorParser from "postcss-selector-parser"
import { get } from "lodash"
import {
  isKeyframeRule,
  isStandardRule,
  isStandardSelector,
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

    const ignoreDescendant = optionsHaveIgnored(options, "descendant")
    const ignoreCompounded = optionsHaveIgnored(options, "compounded")

    root.walkRules(rule => {

      if (!isStandardRule(rule)) { return }
      if (isKeyframeRule(rule)) { return }
      const { selector } = rule
      if (!isStandardSelector(selector)) { return }

      selectorParser(checkSelector).process(selector)

      function checkSelector(selectorAST) {
        selectorAST.walkTags(tag => {

          if (!isStandardTypeSelector(tag)) { return }

          if (ignoreDescendant && hasCombinatorBefore(tag)) { return }

          if (ignoreCompounded && isCompounded(tag)) { return }

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

function hasCombinatorBefore(node) {
  return node.parent.nodes.slice(0, node.parent.nodes.indexOf(node))
    .some(isCombinator)
}

function isCompounded(node) {
  if (node.prev() && !isCombinator(node.prev())) { return true }
  if (node.next() && !isCombinator(node.next())) { return true }
  return false
}

function isCombinator(node) {
  if (!node) return false
  return get(node, "type") === "combinator"
}
