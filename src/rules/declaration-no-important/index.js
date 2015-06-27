import {
  report,
  ruleMessages
} from "../../utils"

export const ruleName = "declaration-no-important"

export const messages = ruleMessages(ruleName, {
  rejected: `Unexpected !important`,
})

export default function () {
  return (root, result) => {
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
