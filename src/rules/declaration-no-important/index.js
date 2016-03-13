import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "declaration-no-important"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected !important",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (!decl.important) { return }

      report({
        message: messages.rejected,
        node: decl,
        word: "important",
        result,
        ruleName,
      })
    })
  }
}
