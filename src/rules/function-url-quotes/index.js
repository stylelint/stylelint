import {
  ruleMessages,
  functionArguments
} from "../../utils"

export const ruleName = "function-url-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (q, f="url") => `Expected ${q} around ${f} argument`,
})

/**
 * @param {"single"|"double"|"none"} expectation
 */
export default function (expectation) {

  const quoteMsg = (() => {
    switch (expectation) {
      case "single":
        return "single quotes"
      case "double":
        return "double quotes"
      case "none":
        return "no quotes"
    }
  }())

  const charDefiesExpectation = (() => {
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

  return function (css, result) {
    css.eachAtRule(checkBlock)
    css.eachRule(checkBlock)

    function checkBlock(block) {
      if (block.type === "atrule") {
        checkAtRuleParams(block)
      }

      block.eachDecl(function (decl) {
        functionArguments(decl.value, "url", args => {
          if (strDefiesExpectation(args)) {
            result.warn(messages.expected(quoteMsg), { node: decl })
          }
        })
      })
    }

    function checkAtRuleParams(atRule) {
      functionArguments(atRule.params, "url", args => {
        if (strDefiesExpectation(args)) {
          result.warn(messages.expected(quoteMsg), { node: atRule })
        }
      })
      functionArguments(atRule.params, "url-prefix", args => {
        if (strDefiesExpectation(args)) {
          result.warn(messages.expected(quoteMsg, "url-prefix"), { node: atRule })
        }
      })
      functionArguments(atRule.params, "domain", args => {
        if (strDefiesExpectation(args)) {
          result.warn(messages.expected(quoteMsg, "domain"), { node: atRule })
        }
      })
    }
  }
}
