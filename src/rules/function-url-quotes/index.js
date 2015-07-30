import {
  cssFunctionArguments,
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "function-url-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (q, f="url") => `Expected ${q} around ${f} argument`,
})

export default function (expectation) {

  const quoteMsg = (function () {
    switch (expectation) {
      case "single":
        return "single quotes"
      case "double":
        return "double quotes"
      case "none":
        return "no quotes"
    }
  }())

  const charDefiesExpectation = (function () {
    switch (expectation) {
      case "single":
        return c => c !== "'"
      case "double":
        return c => c !== "\""
      case "none":
        return c => c === "'" || c === "\""
    }
  }())

  function strDefiesExpectation(str) {
    return charDefiesExpectation(str[0]) || charDefiesExpectation(str[str.length - 1])
  }

  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "single",
        "double",
        "none",
      ],
    })

    root.eachAtRule(check)
    root.eachRule(check)

    function check(statement) {
      if (statement.type === "atrule") {
        checkAtRuleParams(statement)
      }

      statement.eachDecl(function (decl) {
        cssFunctionArguments(decl.value, "url", args => {
          if (strDefiesExpectation(args)) {
            report({
              message: messages.expected(quoteMsg),
              node: decl,
              result,
              ruleName,
            })
          }
        })
      })
    }

    function checkAtRuleParams(atRule) {
      cssFunctionArguments(atRule.params, "url", args => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg),
            node: atRule,
            result,
            ruleName,
          })
        }
      })
      cssFunctionArguments(atRule.params, "url-prefix", args => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg, "url-prefix"),
            node: atRule,
            result,
            ruleName,
          })
        }
      })
      cssFunctionArguments(atRule.params, "domain", args => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg, "domain"),
            node: atRule,
            result,
            ruleName,
          })
        }
      })
    }
  }
}
