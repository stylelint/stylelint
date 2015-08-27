import {
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected whitespace after ":"`,
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

    declarationColonSpaceChecker(checker.after, root, result)
  }
}

export function declarationColonSpaceChecker(locationChecker, root, result) {
  root.walkDecls(decl => {
    const declString = decl.toString()

    for (let i = 0, l = declString.length; i < l; i++) {
      if (declString[i] !== ":") { continue }
      check(declString, i, decl)
      break
    }
  })

  function check(source, index, node) {
    locationChecker({ source, index, err: m =>
      report({
        message: m,
        node: node,
        result,
        ruleName,
      }),
    })
  }
}
