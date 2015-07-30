import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "function-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ","`,
  rejectedAfter: () => `Unexpected whitespace after ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })

    functionCommaSpaceChecker(checker.after, root, result)
  }
}

export function functionCommaSpaceChecker(checkLocation, root, result) {
  root.eachDecl(decl => {
    const value = decl.value

    styleSearch({ source: value, target: ",", withinFunctionalNotation: true }, match => {
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
