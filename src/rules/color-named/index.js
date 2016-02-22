import { includes } from "lodash"
import valueParser from "postcss-value-parser"

import representations from "./representations"
import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "color-named"

export const messages = ruleMessages(ruleName, {
  expected: (named, original) => (
    `Expected "${original}" to be "${named}"`
  ),
  rejected: (named) => (
    `Unexpected named color "${named}"`
  ),
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "never",
        "always-where-possible",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        console.log(node.value);
        if (includes(representations, node.value) && !node.quote) {
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
