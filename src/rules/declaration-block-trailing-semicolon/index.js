import {
  report,
  ruleMessages,
  hasBlock,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-block-trailing-semicolon"

export const messages = ruleMessages(ruleName, {
  expected: "Expected a trailing semicolon",
  rejected: "Unexpected trailing semicolon",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      if (atRule.parent === root) { return }
      if (atRule !== atRule.parent.last) { return }
      if (hasBlock(atRule)) { return }
      checkLastNode(atRule)
    })

    root.walkDecls(decl => {
      if (decl !== decl.parent.last) { return }
      checkLastNode(decl)
    })

    function checkLastNode(node) {
      let message

      if (expectation === "always") {
        if (node.parent.raws.semicolon) { return }
        message = messages.expected
      }
      if (expectation === "never") {
        if (!node.parent.raws.semicolon) { return }
        message = messages.rejected
      }

      report({
        message,
        node,
        index: node.toString().trim().length - 1,
        result,
        ruleName,
      })
    }
  }
}
