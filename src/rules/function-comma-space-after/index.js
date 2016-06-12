import _ from "lodash"
import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  isStandardSyntaxFunction,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "function-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \",\"",
  rejectedAfter: () => "Unexpected whitespace after \",\"",
  expectedAfterSingleLine: () => "Expected single space after \",\" in a single-line function",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \",\" in a single-line function",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
      ],
    })
    if (!validOptions) { return }

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function functionCommaSpaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkDecls(decl => {
    const declValue = _.get(decl, "raws.value.raw", decl.value)

    valueParser(declValue).walk(valueNode => {
      if (valueNode.type !== "function") { return }

      if (!isStandardSyntaxFunction(valueNode)) { return }

      // Ignore `url()` arguments, which may contain data URIs or other funky stuff
      if (valueNode.value.toLowerCase() === "url") { return }

      const functionArguments = (() => {
        let result = valueParser.stringify(valueNode)
        // Remove function name and opening paren
        result = result.slice(valueNode.value.length + 1)
        // Remove closing paren
        result = result.slice(0, result.length - 1)
        // 1. Remove comments including preceeding whitespace (when only succeeded by whitespace)
        // 2. Remove all other comments, but leave adjacent whitespace intact
        result = result.replace(/(\ *\/(\*.*\*\/(?!\S)|\/.*)|(\/(\*.*\*\/|\/.*)))/, "")
        return result
      })()

      styleSearch({
        source: functionArguments,
        target: ",",
        outsideFunctionalNotation: true,
      }, (match) => {
        locationChecker({
          source: functionArguments,
          index: match.startIndex,
          err: (message) => {
            const index = declarationValueIndex(decl) +
              valueNode.value.length + 1 +
              valueNode.sourceIndex +
              match.startIndex
            report({
              index,
              message,
              node: decl,
              result,
              ruleName: checkedRuleName,
            })
          },
        })
      })
    })
  })
}
