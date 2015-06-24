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
  return function (css, result) {
    css.eachDecl(function (decl) {
      const declString = decl.toString()

      for (let i = 0, l = declString.length; i < l; i++) {
        if (declString[i] !== ":") { continue }
        check(declString, i, decl)
        break
      }
    })

    function check(str, index, node) {
      locationChecker(str, index, m =>
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
