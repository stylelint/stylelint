import { get, isString } from "lodash"
import { isKeyframeSelector, isStandardSyntaxRule, isStandardSyntaxSelector, isStandardSyntaxTypeSelector, optionsMatches, parseSelector, report, ruleMessages, validateOptions } from "../../utils"
import resolveNestedSelector from "postcss-resolve-nested-selector"

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
        ignoreTypes: [isString],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    const ignoreDescendant = optionsMatches(options, "ignore", "descendant")
    const ignoreCompounded = optionsMatches(options, "ignore", "compounded")

    root.walkRules(rule => {
      const selector = rule.selector,
        selectors = rule.selectors

      if (!isStandardSyntaxRule(rule)) {
        return
      }
      if (!isStandardSyntaxSelector(selector)) {
        return
      }
      if (selectors.some(s => isKeyframeSelector(s))) {
        return
      }

      if (ignoreDescendant) {
        // Resolve each selector within the list before checking
        selectors.forEach(selector => {
          resolveNestedSelector(selector, rule).forEach(selector => {
            checkSelector(selector, rule)
          })
        })
      } else {
        checkSelector(selector, rule)
      }
    })

    function checkSelector(selector, rule) {
      parseSelector(selector, result, rule, selectorAST => {
        selectorAST.walkTags(tag => {
          if (!isStandardSyntaxTypeSelector(tag)) {
            return
          }

          if (optionsMatches(options, "ignoreTypes", tag.value)) {
            return
          }

          if (ignoreDescendant && hasCombinatorBefore(tag)) {
            return
          }

          if (ignoreCompounded && isCompounded(tag)) {
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
      })
    }
  }
}

function hasCombinatorBefore(node) {
  return node.parent.nodes.slice(0, node.parent.nodes.indexOf(node)).some(isCombinator)
}

function isCompounded(node) {
  if (node.prev() && !isCombinator(node.prev())) {
    return true
  }
  if (node.next() && !isCombinator(node.next())) {
    return true
  }
  return false
}

function isCombinator(node) {
  if (!node) return false
  return get(node, "type") === "combinator"
}
