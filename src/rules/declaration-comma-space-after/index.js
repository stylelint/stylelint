import {
  ruleMessages,
  whitespaceChecker,
  styleSearch
} from "../../utils"

export const ruleName = "declaration-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after comma within a declaration value`,
  rejectedAfter: () => `Unexpected space after comma within a declaration value`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationCommaSpaceChecker(checker.after)
}

export function declarationCommaSpaceChecker(checkLocation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      styleSearch({ source: value, target: ",", outsideFunctionalNotation: true }, match => {
        checkComma(value, match.startIndex, decl)
      })
    })

    function checkComma(source, index, node) {
      checkLocation(source, index, m => result.warn(m, { node }))
    }
  }
}
