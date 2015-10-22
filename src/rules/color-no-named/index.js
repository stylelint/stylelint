import valueParser from "postcss-value-parser"
import isCssColorName from "is-css-color-name"

import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "color-no-named"

export const messages = ruleMessages(ruleName, {
  rejected: c => `Unexpected named color "${c}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { value } = decl

      valueParser(value).walk(function (node) {
        const charsBeforeColon = decl.toString().indexOf(":")
        const charsAfterColon = decl.raw("between").length - decl.raw("between").indexOf(":")

        if (isCssColorName(node.value) && !node.quote) {
          report({
            message: messages.rejected(node.value),
            node: decl,
            index: charsBeforeColon + charsAfterColon + node.sourceIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

