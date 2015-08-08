import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "declaration-no-important"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected !important`,
})

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: o,
      possible: [],
    })
    if (!validOptions) { return }

    root.eachDecl(decl => {
      if (!decl.important) { return }

      report({
        message: messages.rejected,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
