import valueParser from "postcss-value-parser"
import isCssColorName from "is-css-color-name"

import {
  declarationValueIndexOffset,
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
      valueParser(decl.value).walk(node => {
        if (isCssColorName(node.value) && !node.quote) {
          report({
            message: messages.rejected(node.value),
            node: decl,
            index: declarationValueIndexOffset(decl) + node.sourceIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
