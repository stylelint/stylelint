import {
  ruleMessages,
  whitespaceChecker,
  styleSearch,
  functionArguments
} from "../../utils"

export const ruleName = "function-calc-no-unspaced-operator"

export const messages = ruleMessages(ruleName, {
  expectedBefore: o => `Expected single space before "${o}" operator within calc function`,
  expectedAfter: o => `Expected single space after "${o}" operator within calc function`,
  expectedOperatorBeforeSign: o => `Expected an operator before sign "${o}" within calc function`,
})

export default function () {
  const checker = whitespaceChecker(" ", "always", messages)

  return function (css, result) {
    css.eachDecl(function (decl) {
      const value = decl.value

      functionArguments(value, "calc", expression => {

        checkSymbol("+")
        checkSymbol("-")
        checkSymbol("*")
        checkSymbol("/")

        function checkSymbol(symbol) {
          styleSearch({ source: expression, target: symbol, outsideFunctions: true }, index => {
            // Deal with signs
            if ((symbol === "+" || symbol === "-") && /\d/.test(expression[index + 1])) {
              const expressionBeforeSign = expression.substr(0, index)
              // Ignore signs at the beginning of the expression
              if (/^\s*$/.test(expressionBeforeSign)) { return }

              // Otherwise, ensure that there is a real operator preceeding them
              if (/[\*/+-]\s*$/.test(expressionBeforeSign)) { return }

              result.warn(messages.expectedOperatorBeforeSign(symbol), { node: decl })
              return
            }

            checker.after(expression, index, m => result.warn(m, { node: decl }))
            checker.before(expression, index, m => result.warn(m, { node: decl }))
          })
        }

      })
    })
  }
}
