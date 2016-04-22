import resolvedNestedSelector from "postcss-resolve-nested-selector"
import selectorParser from "postcss-selector-parser"
import {
  cssRuleHasSelectorEndingWithColon,
  cssRuleIsKeyframe,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-no-qualifying-type"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected selector qualified by type",
})

const selectorCharacters = [
  "#", ".", "[",
]

function isSelectorCharacters(value) {
  return selectorCharacters.some(char => value.indexOf(char) !== -1)
}

function getLeftNodes(node) {
  const result = []
  let leftNode = node

  while ((leftNode = leftNode.prev())) {
    if (leftNode.type === "combinator") { break }
    if (leftNode.type !== "id"
      && leftNode.type !== "class"
      && leftNode.type !== "attribute"
    ) { continue }

    result.push(leftNode)
  }

  return result
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
      if (
        cssRuleHasSelectorEndingWithColon(rule)
        || cssRuleIsKeyframe(rule)
        || !isSelectorCharacters(rule.selector)
      ) { return }

      // Return early if there is interpolation in the selector
      if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(rule.selector)) {
        return
      }

      function checkSelector(selectorAST) {
        selectorAST.eachTag(selector => {
          const selectorParent = selector.parent

          if (selectorParent.nodes.length === 1) {
            return
          }

          const leftNodes = getLeftNodes(selector)
          const rightNodes = getRightNodes(selector)
          const concatNodes = [].concat(leftNodes, rightNodes)
          const index = selector.sourceIndex

          concatNodes.forEach((selectorNode) => {
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
        selectorParser(checkSelector).process(resolvedSelector)
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
