import {
  hasBlock,
  optionsHasKeyword,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import _ from "lodash"

export const ruleName = "max-nesting-depth"

export const messages = ruleMessages(ruleName, {
  expected: depth => `Expected nesting depth to be no more than ${depth}`,
})

export default function (max, options) {
  const ignoreAtRulesWithoutDeclarationBlocks = optionsHasKeyword(options, "ignore", "at-rules-without-declaration-blocks")

  return (root, result) => {
    validateOptions(result, ruleName, {
      actual: max,
      possible: [_.isNumber],
    }, {
      optional: true,
      actual: options,
      possible: {
        ignore: ["at-rules-without-declaration-blocks"],
      },
    })

    root.walkRules(checkStatement)
    root.walkAtRules(checkStatement)

    function checkStatement(statement) {
      if (!hasBlock(statement)) { return }
      const depth = nestingDepth(statement)
      if (depth > max) {
        report({
          ruleName,
          result,
          node: statement,
          message: messages.expected(max),
        })
      }
    }
  }

  function nestingDepth(node, level) {
    level = level || 0
    const { parent } = node

    // The nesting depth level's computation has finished
    // when this function, recursively called, receives
    // a node that is not nested -- a direct child of the
    // root node
    if (
      parent.type === "root"
      || (parent.type === "atrule" && parent.parent.type === "root")) {
      return level
    }

    if (
      ignoreAtRulesWithoutDeclarationBlocks
      && node.type === "atrule"
      && node.every(child => child.type !== "decl")
    ) {
      return nestingDepth(parent, level)
    }

    // Unless any of the conditions above apply, we want to
    // add 1 to the nesting depth level and then check the parent,
    // continuing to add and move up the hierarchy
    // until we hit the root node
    return nestingDepth(parent, level + 1)
  }
}
