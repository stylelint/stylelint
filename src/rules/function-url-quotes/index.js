import {
  isStandardSyntaxUrl,
  functionArgumentsSearch,
  atRuleParamIndex,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-url-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (q, f = "url") => `Expected ${q} around ${f} argument`,
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

      case "always":
        return "quotes"
      case "never":
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

      case "never":
        return c => c === "'" || c === "\""
      case "always":
        return c => c !== "'" && c !== "\""
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

        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    if (
      expectation === "single"
      || expectation === "double"
      || expectation === "none"
    ) {
      result.warn((
        "The '" + expectation + "' option for 'function-url-quotes' has been deprecated, "
          + "and will be removed in '7.0'. Instead, use the 'always' or 'never' options together with the 'string-quotes' rule."
      ), {
        stylelintType: "deprecation",
        stylelintReference: "http://stylelint.io/user-guide/rules/function-url-quotes/",
      })
    }

    root.walkAtRules(check)
    root.walkRules(check)

    function check(statement) {
      if (statement.type === "atrule") {
        checkAtRuleParams(statement)
      }

      statement.walkDecls(function (decl) {
        functionArgumentsSearch(decl.toString().toLowerCase(), "url", (args, index) => {
          if (!isStandardSyntaxUrl(args)) { return }
          const trimLeftArgs = args.trimLeft()
          if (!strDefiesExpectation(trimLeftArgs.trimRight())) { return }
          complain(messages.expected(quoteMsg), decl, index + args.length - trimLeftArgs.length)
        })
      })
    }

    function checkAtRuleParams(atRule) {
      const atRuleParamsLowerCase = atRule.params.toLowerCase()
      functionArgumentsSearch(atRuleParamsLowerCase, "url", (args, index) => {
        if (!isStandardSyntaxUrl(args)) { return }
        const trimLeftArgs = args.trimLeft()
        if (!strDefiesExpectation(trimLeftArgs.trimRight())) { return }
        complain(
          messages.expected(quoteMsg),
          atRule,
          index + args.length - trimLeftArgs.length + atRuleParamIndex(atRule)
        )
      })
      functionArgumentsSearch(atRuleParamsLowerCase, "url-prefix", (args, index) => {
        if (!isStandardSyntaxUrl(args)) { return }
        const trimLeftArgs = args.trimLeft()
        if (!strDefiesExpectation(trimLeftArgs.trimRight())) { return }
        complain(
          messages.expected(quoteMsg, "url-prefix"),
          atRule,
          index + args.length - trimLeftArgs.length + atRuleParamIndex(atRule)
        )
      })
      functionArgumentsSearch(atRuleParamsLowerCase, "domain", (args, index) => {
        if (!isStandardSyntaxUrl(args)) { return }
        const trimLeftArgs = args.trimLeft()
        if (!strDefiesExpectation(trimLeftArgs.trimRight())) { return }
        complain(
          messages.expected(quoteMsg, "domain"),
          atRule,
          index + args.length - trimLeftArgs.length + atRuleParamIndex(atRule)
        )
      })
    }

    function complain(message, node, index) {
      report({
        message,
        node,
        index,
        result,
        ruleName,
      })
    }
  }
}
