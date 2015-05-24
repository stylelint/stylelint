import {
  ruleMessages,
  whitespaceChecker,
  valueIndexOf,
  functionArguments
} from "../../utils"

export const ruleName = "function-calc-operator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after operator within calc function`,
  rejectedAfter: () => `Unexpected space after operator within calc function`,
})

const operators = [ "+", "/", "-", "*" ]

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return functionCalcOperatorSpaceChecker(checker.after)
}

export function functionCalcOperatorSpaceChecker(checkLocation) {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      functionArguments(value, "calc", calcInnards => {
        console.log(calcInnards)
        valueIndexOf({ value: calcInnards, char: operators, outsideFunction: true }, index => {
          checkComma(calcInnards, index, decl)
        })
      })
    })

    function checkComma(source, index, node) {
      checkLocation(source, index, m => result.warn(m, { node }))
    }
  }
}
