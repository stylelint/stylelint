import execall from "execall"
import _ from "lodash"
import {
  blurFunctionArguments,
  hasBlock,
  beforeBlockString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "number-leading-zero"

export const messages = ruleMessages(ruleName, {
  expected: "Expected a leading zero",
  rejected: "Unexpected leading zero",
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
      if (atRule.name.toLowerCase() === "import") { return }

      const source = (hasBlock(atRule))
        ? beforeBlockString(atRule, { noRawBefore: true })
        : atRule.toString()
      check(source, atRule)
    })

    function check(source, node) {
      // Get out quickly if there are no periods
      if (source.indexOf(".") === -1) { return }

      // Check leading zero
      if (expectation === "always") {
        const errors = matchesLackingLeadingZero(source)
        if (!_.isEmpty(errors)) {
          errors.forEach(error => {
            complain(messages.expected, node, error.index)
          })
        }
      }
      if (expectation === "never") {
        const errors = matchesContainingLeadingZero(source)
        if (!_.isEmpty(errors)) {
          errors.forEach(error => {
            complain(messages.rejected, node, error.index + 1)
          })
        }
      }
    }

    function complain(message, node, index) {
      report({
        result,
        ruleName,
        message,
        node,
        index,
      })
    }
  }
}

function matchesLackingLeadingZero(source) {
  return execall(/(?:\D|^)(\.\d+)/g, blurFunctionArguments(source, "url"))
}

function matchesContainingLeadingZero(source) {
  return execall(/(?:\D|^)(0\.\d+)/g, blurFunctionArguments(source, "url"))
}
