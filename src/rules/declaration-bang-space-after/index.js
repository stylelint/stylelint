import {
  declarationValueIndex,
  styleSearch,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-bang-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"!\"",
  rejectedAfter: () => "Unexpected whitespace after \"!\"",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    declarationBangSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function declarationBangSpaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkDecls(function (decl) {
    const indexOffset = declarationValueIndex(decl)
    const declString = decl.toString()
    const valueString = decl.toString().slice(indexOffset)
    if (valueString.indexOf("!") == -1) { return }

    styleSearch({ source: valueString, target: "!" }, match => {
      check(declString, match.startIndex + indexOffset, decl)
    })
  })

  function check(source, index, node) {
    locationChecker({ source, index, err: m =>
      report({
        message: m,
        node,
        index,
        result,
        ruleName: checkedRuleName,
      }),
    })
  }
}
