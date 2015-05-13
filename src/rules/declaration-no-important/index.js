export const ruleName = "declaration-no-important"

export const messages = {
  rejected: `!important disallowed (${ruleName})`,
}

export default function declarationNoImportant() {
  return (css, result) => {

    css.eachDecl(function (decl) {
      if (!decl.important) {
        return
      }

      result.warn(
        messages.rejected,
        { node: decl }
      )
    })
  }
}
