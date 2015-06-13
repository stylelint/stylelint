import {
  report,
  ruleMessages,
  styleSearch,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ","`,
  rejectedAfter: () => `Unexpected space after ","`,
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
      checkLocation(source, index, m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        })
      )
    }
  }
}
