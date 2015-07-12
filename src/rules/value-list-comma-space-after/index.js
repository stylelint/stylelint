import {
  report,
  ruleMessages,
  styleSearch,
  whitespaceChecker
} from "../../utils"

export const ruleName = "value-list-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ","`,
  rejectedAfter: () => `Unexpected whitespace after ","`,
  expectedAfterSingleLine: () => `Expected single space after "," in a single-line list`,
  rejectedAfterSingleLine: () => `Unexpected whitespace after "," in a single-line list`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return valueListCommaWhitespaceChecker(checker.after)
}

export function valueListCommaWhitespaceChecker(checkLocation) {
  return (root, result) => {
    root.eachDecl(decl => {
      const value = decl.value

      styleSearch({ source: value, target: ",", outsideFunctionalNotation: true }, match => {
        checkComma(value, match.startIndex, decl)
      })
    })

    function checkComma(source, index, node) {
      checkLocation({ source, index, err: m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        }),
      })
    }
  }
}
