import {
  ruleMessages,
  whitespaceChecker,
  valueIndexOf
} from "../../utils"

export const ruleName = "function-calc-operator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after operator within calc function`,
  rejectedAfter: () => `Unexpected space after operator within calc function`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return functionCommaSpaceChecker(checker.after)
}

export function functionCommaSpaceChecker(checkLocation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      valueIndexOf({ value, char: ",", insideFunction: true }, index => {
        checkComma(value, index, decl)
      })
    })

    function checkComma(source, index, node) {
      checkLocation(source, index, m => result.warn(m, { node }))
    }
  }
}
