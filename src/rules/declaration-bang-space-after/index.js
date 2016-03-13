import {
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
    if (!decl.important) { return }
    const declString = decl.toString()

    // Start from the right and only pay attention to the first
    // exclamation mark found
    for (let i = declString.length - 1; i >= 0; i--) {
      if (declString[i] !== "!") { continue }
      check(declString, i, decl)
      break
    }
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
