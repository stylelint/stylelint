import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-no-duplicate-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected duplicate property "${p}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    // In order to accommodate nested blocks (postcss-nested),
    // we need to run a shallow loop (instead of eachDecl() or eachRule(),
    // which loop recursively) and allow each nested block to accumulate
    // its own list of properties -- so that a property in a nested rule
    // does not conflict with the same property in the parent rule
    root.each(node => {
      if (node.type === "rule" || node.type === "atrule") {
        checkRulesInNode(node)
      }
    })

    function checkRulesInNode(node) {
      let decls = []
      node.each(child => {
        if (child.nodes && child.nodes.length) {
          checkRulesInNode(child)
        }
        if (child.type !== "decl") { return }
        const prop = child.prop
        if (decls.indexOf(prop) !== -1) {
          report({
            message: messages.rejected(prop),
            node: child,
            result,
            ruleName,
          })
        }
        decls.push(prop)
      })
    }
  }
}
