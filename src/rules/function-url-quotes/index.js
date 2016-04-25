import {
  atRuleParamIndex,
  functionArgumentsSearch,
  isStandardUrl,
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
        if (decl.value.indexOf("url(") === -1) { return }

        functionArgumentsSearch(decl.toString(), "url", (args, index) => {
          if (!strDefiesExpectation(args) || !isStandardUrl(args)) { return }

          complain(messages.expected(quoteMsg), decl, index)
        })
      })
    }

    function checkAtRuleParams(atRule) {
      functionArgumentsSearch(atRule.params, "url", (args, index) => {
        if (!strDefiesExpectation(args) || !isStandardUrl(args)) { return }

        complain(messages.expected(quoteMsg), atRule, index + atRuleParamIndex(atRule))
      })
      functionArgumentsSearch(atRule.params, "url-prefix", (args, index) => {
        if (!strDefiesExpectation(args) || !isStandardUrl(args)) { return }

        complain(messages.expected(quoteMsg, "url-prefix"), atRule, index + atRuleParamIndex(atRule))
      })
      functionArgumentsSearch(atRule.params, "domain", (args, index) => {
        if (!strDefiesExpectation(args) || !isStandardUrl(args)) { return }

        complain(messages.expected(quoteMsg, "domain"), atRule, index + atRuleParamIndex(atRule))
      })
    }

    function complain(message, node, index) {
      report({
        index,
        message,
        node,
        result,
        ruleName,
      })
    }
  }
}
