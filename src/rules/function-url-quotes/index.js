import {
  cssFunctionArguments,
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  validateOptions,
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
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "single",
        "double",
        "none",
      ],
    })
    if (!validOptions) { return }

    root.walkAtRules(check)
    root.walkRules(check)

    function check(statement) {
      if (statement.type === "atrule") {
        checkAtRuleParams(statement)
      }

      statement.walkDecls(function (decl) {
        cssFunctionArguments(decl.toString(), "url", (args, index) => {
          if (strDefiesExpectation(args)) {
            report({
              message: messages.expected(quoteMsg),
              node: decl,
              index,
              result,
              ruleName,
            })
          }
        })
      })
    }

    function checkAtRuleParams(atRule) {
      cssFunctionArguments(atRule.params, "url", (args, index) => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg),
            node: atRule,
            index: index + mediaQueryParamIndexOffset(atRule),
            result,
            ruleName,
          })
        }
      })
      cssFunctionArguments(atRule.params, "url-prefix", (args, index) => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg, "url-prefix"),
            node: atRule,
            index: index + mediaQueryParamIndexOffset(atRule),
            result,
            ruleName,
          })
        }
      })
      cssFunctionArguments(atRule.params, "domain", (args, index) => {
        if (strDefiesExpectation(args)) {
          report({
            message: messages.expected(quoteMsg, "domain"),
            node: atRule,
            index: index + mediaQueryParamIndexOffset(atRule),
            result,
            ruleName,
          })
        }
      })
    }
  }
}
