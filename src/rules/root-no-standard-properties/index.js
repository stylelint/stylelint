import selectorParser from "postcss-selector-parser"
import {
  isStandardProperty,
  isCustomProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "root-no-standard-properties"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected standard property "${p}" applied to ":root"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      if (rule.selector.indexOf(":root") === -1) { return }
      selectorParser(checkSelector).process(rule.selector)

      function checkSelector(selectorAST) {
        if (ignoreRule(selectorAST)) { return }

        rule.walkDecls(function (decl) {

          const { prop } = decl
          if (!isStandardProperty(prop)) { return }
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
  selectorAST.eachInside(selectorNode => {
    // ignore `:root` selector inside a `:not()` selector
    if (selectorNode.value === ":root" && selectorNode.parent.parent.value === ":not") {
      ignore = true
    }
  })
  return ignore
}
