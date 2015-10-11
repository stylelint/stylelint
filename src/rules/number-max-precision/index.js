import { isNumber } from "lodash"
import execall from "execall"
import {
  blurComments,
  cssStatementHasBlock,
  cssStatementStringBeforeBlock,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "number-max-precision"

export const messages = ruleMessages(ruleName, {
  expected: (number, precision) => `Expected "${number}" to be "${number.toFixed(precision)}"`,
})

export default function (precision) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: precision,
      possible: [isNumber],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      // Don't bother with strings
      if (decl.prop === "content") { return }
      check(decl.toString(), decl)
    })

    root.walkAtRules(atRule => {
      const source = (cssStatementHasBlock(atRule))
        ? cssStatementStringBeforeBlock(atRule, { noBefore: true })
        : atRule.toString()
      check(source, atRule)
    })

    function check(source, node) {
      // Negative
      const decimalNumberMatches = execall(/(\d*\.(\d+))/g, blurComments(source))
      if (!decimalNumberMatches.length) { return }

      decimalNumberMatches.forEach(match => {
        if (match.sub[1].length <= precision) { return }
        report({
          result,
          ruleName,
          node,
          index: match.index,
          message: messages.expected(parseFloat(match.sub[0]), precision),
        })
      })
    }
  }
}
