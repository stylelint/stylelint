const ruleName = "declaration-no-important"

export const messages = {
  unexpected: `Unexpected !important (${ruleName})`,
}

/**
 * @param {boolean} options - If true, no !important;
 *   if false, do nothing
 */
export default function declarationNoImportant(options) {
  return (css, result) => {
    if (options) {
      css.eachDecl(function (decl) {
        if (!decl.important) {
          return
        }

        result.warn(
          messages.unexpected,
          { node: decl }
        )
      })
    }
  }
}
