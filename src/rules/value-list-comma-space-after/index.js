import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "value-list-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \",\"",
  rejectedAfter: () => "Unexpected whitespace after \",\"",
  expectedAfterSingleLine: () => "Expected single space after \",\" in a single-line list",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \",\" in a single-line list",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
      ],
    })
    if (!validOptions) { return }

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function valueListCommaWhitespaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkDecls(decl => {
    styleSearch({ source: decl.toString(), target: ",", outsideFunctionalNotation: true }, match => {
      checkComma(decl.toString(), match.startIndex, decl)
    })
  })

  function checkComma(source, index, node) {
    locationChecker({
      source,
      index,
      err: m => {
        report({
          message: m,
          node,
          index,
          result,
          ruleName: checkedRuleName,
        })
      },
    })
  }
}
