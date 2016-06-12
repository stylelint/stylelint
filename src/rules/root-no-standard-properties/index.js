import {
  isStandardSyntaxProperty,
  isCustomProperty,
  parseSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected standard property "${property}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (rule.selector.toLowerCase().indexOf(":root") === -1) { return }
      parseSelector(rule.selector, result, rule, checkSelector)

      function checkSelector(selectorAST) {
        if (ignoreRule(selectorAST)) { return }

        rule.walkDecls(function (decl) {

          const { prop } = decl
          if (!isStandardSyntaxProperty(prop)) { return }
          if (isCustomProperty(prop)) { return }

          report({
            message: messages.rejected(prop),
            node: decl,
            result,
            ruleName,
          })
        })
      }
    })
  }
}

function ignoreRule(selectorAST) {
  let ignore = false
  selectorAST.walk(selectorNode => {
    // ignore `:root` selector inside a `:not()` selector
    if (selectorNode.value
      && selectorNode.value.toLowerCase() === ":root"
      && selectorNode.parent.parent.value
      && selectorNode.parent.parent.value.toLowerCase() === ":not"
    ) {
      ignore = true
    }
  })
  return ignore
}
