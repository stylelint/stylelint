import { isNumber } from "lodash"
import execall from "execall"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "number-max-precision"

export const messages = ruleMessages(ruleName, {
  expected: (number, precision) => `Expected "${number}" to be "${number.toFixed(precision)}"`,
})

export default function (precision) {
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: precision,
      possible: [isNumber],
    })

    root.eachDecl(decl => {
      // Don't bother with strings
      if (decl.prop === "content") { return }
      check(decl.value, decl)
    })

    root.eachAtRule(atRule => {
      check(atRule.params, atRule)
    })

    function check(source, node) {
      const decimalNumberMatches = execall(/(\d*\.(\d+))/g, source)
      if (!decimalNumberMatches) { return }

      decimalNumberMatches.forEach(match => {
        if (match.sub[1].length <= precision) { return }
        report({
          result,
          ruleName,
          node,
          message: messages.expected(parseFloat(match.sub[0]), precision),
        })
      })
    }
  }
}
