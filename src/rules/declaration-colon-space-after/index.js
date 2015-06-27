import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected whitespace after ":"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationColonSpaceChecker(checker.after)
}

export function declarationColonSpaceChecker(locationChecker) {
  return (root, result) => {
    root.eachDecl(decl => {
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
}
