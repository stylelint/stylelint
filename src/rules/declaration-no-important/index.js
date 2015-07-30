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
    validateOptions({ result, ruleName, actual: o })

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
