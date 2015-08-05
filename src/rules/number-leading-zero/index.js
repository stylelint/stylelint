import {
  report,
  ruleMessages,
  validateOptions
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

    root.eachDecl(decl => {
      check(decl.value, decl)
    })

    root.eachAtRule(atRule => {
      check(atRule.params, atRule)
    })

    function check(source, node) {
      // Get out quickly if there are no periods
      if (source.indexOf(".") === -1) { return }

        // check leadingzero
      if (expectation === "always" && !lacksLeadingZero(source)) { return }
      if (expectation === "never" && !containsLeadingZero(source)) { return }

      const message = (expectation === "always") ? messages.expected : messages.rejected

      report({
        message: message,
        node,
        result,
        ruleName,
      })
    }
  }
}

function lacksLeadingZero(value) {
  return /(?:\D|^)\.\d+/g.test(value)
}

function containsLeadingZero(value) {
  return /(?:\D|^)0\.\d+/g.test(value)
}
