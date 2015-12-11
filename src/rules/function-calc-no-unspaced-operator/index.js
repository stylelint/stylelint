import {
  cssFunctionArguments,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "function-calc-no-unspaced-operator"

export const messages = ruleMessages(ruleName, {
  expectedBefore: o => `Expected single space before "${o}" operator`,
  expectedAfter: o => `Expected single space after "${o}" operator`,
  expectedOperatorBeforeSign: o => `Expected an operator before sign "${o}"`,
})

export default function (actual) {
  const checker = whitespaceChecker("space", "always", messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      cssFunctionArguments(decl.toString(), "calc", (rawExpression, expressionIndex) => {
        const expression = blurVariables(rawExpression)

        checkSymbol("+")
        checkSymbol("-")
        checkSymbol("*")
        checkSymbol("/")

        function checkSymbol(symbol) {
          styleSearch({ source: expression, target: symbol, outsideFunctionalNotation: true }, match => {
            const index = match.startIndex

            // Deal with signs.
            // (@ and $ are considered "digits" here to allow for variable syntaxes
            // that permit signs in front of variables, e.g. `-$number`)
            if ((symbol === "+" || symbol === "-") && /[\d@\$]/.test(expression[index + 1])) {
              const expressionBeforeSign = expression.substr(0, index)
              // Ignore signs at the beginning of the expression
              if (/^\s*$/.test(expressionBeforeSign)) { return }

              // Otherwise, ensure that there is a real operator preceeding them
              if (/[\*/+-]\s*$/.test(expressionBeforeSign)) { return }

              report({
                message: messages.expectedOperatorBeforeSign(symbol),
                node: decl,
                index: expressionIndex + index,
                result,
                ruleName,
              })

              return
            }

            checker.after({
              index,
              source: expression,
              err: m => {
                report({
                  message: m,
                  node: decl,
                  index: expressionIndex + index,
                  result,
                  ruleName,
                })
              },
            })
            checker.before({
              index,
              source: expression,
              err: m => {
                report({
                  message: m,
                  node: decl,
                  index: expressionIndex + index,
                  result,
                  ruleName,
                })
              },
            })
          })
        }
      })
    })
  }
}

function blurVariables(source) {
  return source.replace(/[\$@][^\)\s]+/g, "0")
}
