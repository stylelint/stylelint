import resolvedNestedSelector from "postcss-resolve-nested-selector"
import {
  isKeyframeRule,
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  optionsHaveIgnored,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-qualifying-type"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected qualifying type selector",
})

const selectorCharacters = [
  "#", ".", "[",
]

function isSelectorCharacters(value) {
  return selectorCharacters.some(char => value.indexOf(char) !== -1)
}

function getRightNodes(node) {
  const result = []
  let rightNode = node

  while ((rightNode = rightNode.next())) {
    if (rightNode.type === "combinator") { break }
    if (rightNode.type !== "id"
      && rightNode.type !== "class"
      && rightNode.type !== "attribute"
    ) { continue }

    result.push(rightNode)
  }

  return result
}

export default (enabled, options) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: enabled,
      possible: [ true, false ],
    }, {
      actual: options,
      possible: {
        ignore: [ "attribute", "class", "id" ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) { return }
      if (isKeyframeRule(rule)) { return }
      if (!isStandardSyntaxSelector(rule.selector)) { return }
      if (!isSelectorCharacters(rule.selector)) { return }

      function checkSelector(selectorAST) {
        selectorAST.walkTags(selector => {
          const selectorParent = selector.parent

          if (selectorParent.nodes.length === 1) {
            return
          }

          const selectorNodes = getRightNodes(selector)
          const index = selector.sourceIndex

          selectorNodes.forEach((selectorNode) => {
            if (selectorNode.type === "id" && !optionsHaveIgnored(options, "id")) {
              complain(index)
            }

            if (selectorNode.type === "class" && !optionsHaveIgnored(options, "class")) {
              complain(index)
            }

            if (selectorNode.type === "attribute" && !optionsHaveIgnored(options, "attribute")) {
              complain(index)
            }
          })
        })
      }

      resolvedNestedSelector(rule.selector, rule).forEach(resolvedSelector => {
        parseSelector(resolvedSelector, result, rule, checkSelector)
      })

      function complain(index) {
        report({
          ruleName,
          result,
          node: rule,
          message: messages.rejected,
          index,
        })
      }
    })
  }
}
