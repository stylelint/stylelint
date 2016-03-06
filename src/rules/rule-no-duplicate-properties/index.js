import {
  report,
  ruleMessages,
  cssWordIsVariable,
  validateOptions,
} from "../../utils"

export const ruleName = "rule-no-duplicate-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected duplicate property "${p}"`,
})

export default function (actual) {
  return (root, result) => {

    result.warn((
      "'rule-no-duplicate-properties' has been deprecated " +
      "and in 5.0 it will be removed. " +
      "Use 'declaration-block-no-duplicate-properties' instead."
    ), {
      stylelintType: "deprecation",
      stylelintReference: "http://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties/",
    })

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
      const decls = []
      node.each(child => {
        if (child.nodes && child.nodes.length) {
          checkRulesInNode(child)
        }
        if (child.type !== "decl") { return }
        const prop = child.prop

        if (cssWordIsVariable(prop)) { return }

        // Ignore the src property as commonly duplicated in at-fontface
        if (prop === "src") { return }

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
