import {
  atRuleParamIndex,
  functionArgumentsSearch,
  isStandardSyntaxUrl,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-url-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (f = "url") => `Expected quotes around ${f} argument`,
  rejected: (f = "url") => `Unexpected quotes around ${f} argument`,
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

    root.walkAtRules(checkStatement)
    root.walkRules(checkStatement)

    function checkStatement(statement) {
      if (statement.type === "atrule") {
        checkAtRuleParams(statement)
      }

      statement.walkDecls(function (decl) {
        functionArgumentsSearch(decl.toString().toLowerCase(), "url", (args, index) => {
          checkArgs(args, decl, index, "url")
        })
      })
    }

    function checkAtRuleParams(atRule) {
      const atRuleParamsLowerCase = atRule.params.toLowerCase()
      functionArgumentsSearch(atRuleParamsLowerCase, "url", (args, index) => {
        checkArgs(args, atRule, index + atRuleParamIndex(atRule), "url")
      })
      functionArgumentsSearch(atRuleParamsLowerCase, "url-prefix", (args, index) => {
        checkArgs(args, atRule, index + atRuleParamIndex(atRule), "url-prefix")
      })
      functionArgumentsSearch(atRuleParamsLowerCase, "domain", (args, index) => {
        checkArgs(args, atRule, index + atRuleParamIndex(atRule), "domain")
      })
    }

    function checkArgs(args, node, index, functionName) {
      const leftTrimmedArgs = args.trimLeft()
      if (!isStandardSyntaxUrl(leftTrimmedArgs)) { return }
      const complaintIndex = index + args.length - leftTrimmedArgs.length
      const hasQuotes = leftTrimmedArgs[0] === "'" || leftTrimmedArgs[0] === "\""
      switch (expectation) {
        case "always":
          if (hasQuotes) { return }
          complain(messages.expected(functionName), node, complaintIndex)
          return
        case "never":
          if (!hasQuotes) { return }
          complain(messages.rejected(functionName), node, complaintIndex)
          return
      }
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
