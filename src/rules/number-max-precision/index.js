import { isNumber } from "lodash"
import execall from "execall"
import {
  beforeBlockString,
  blurComments,
  blurFunctionArguments,
  hasBlock,
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
      if (decl.prop.toLowerCase() === "content") { return }
      check(decl.toString(), decl)
    })

    root.walkAtRules(atRule => {
      // Ignore @imports
      if (atRule.name.toLowerCase() === "import") { return }

      const source = (hasBlock(atRule))
        ? beforeBlockString(atRule, { noRawBefore: true })
        : atRule.toString()
      check(source, atRule)
    })

    function check(source, node) {

      const sanitizedSource = blurComments(blurFunctionArguments(source, "url"))
      const decimalNumberMatches = execall(/(\d*\.(\d+))/g, sanitizedSource)
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
