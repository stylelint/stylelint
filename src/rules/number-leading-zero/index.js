import {
  cssStatementHasBlock,
  cssStatementStringBeforeBlock,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "number-leading-zero"

export const messages = ruleMessages(ruleName, {
  expected: `Expected a leading zero`,
  rejected: `Unexpected leading zero`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      check(decl.toString(), decl)
    })

    root.walkAtRules(atRule => {
      const source = (cssStatementHasBlock(atRule))
        ? cssStatementStringBeforeBlock(atRule, { noBefore: true })
        : atRule.toString()
      check(source, atRule)
    })

    function check(source, node) {
      // Get out quickly if there are no periods
      if (source.indexOf(".") === -1) { return }

      let errorIndex
      let message

        // check leadingzero
      if (expectation === "always") {
        const error = lacksLeadingZero(source)
        if (error) {
          errorIndex = error.index
          message = messages.expected
        } else {
          return
        }
      }
      if (expectation === "never") {
        const error = containsLeadingZero(source)
        if (error) {
          errorIndex = error.index + 1
          message = messages.rejected
        } else {
          return
        }
      }

      report({
        message,
        node,
        index: errorIndex,
        result,
        ruleName,
      })
    }
  }
}

function lacksLeadingZero(source) {
  return /(?:\D|^)(\.\d+)/g.exec(source)
}

function containsLeadingZero(source) {
  return /(?:\D|^)(0\.\d+)/g.exec(source)
}
