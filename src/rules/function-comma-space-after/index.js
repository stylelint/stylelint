import valueParser from "postcss-value-parser"
import {
  cssDeclarationIsMap,
  declarationValueIndexOffset,
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
    if (cssDeclarationIsMap(decl)) { return }

    valueParser(decl.value).walk(valueNode => {
      if (valueNode.type !== "function") { return }

      // Function nodes without names are things in parentheses like Sass lists
      if (!valueNode.value) { return }

      // Ignore `url()` arguments, which may contain data URIs or other funky stuff
      if (valueNode.value === "url") { return }

      const functionArguments = (() => {
        let result = valueParser.stringify(valueNode)
        // Remove function name and opening paren
        result = result.slice(valueNode.value.length + 1)
        // Remove closing paren
        result = result.slice(0, result.length - 1)
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
            const index = declarationValueIndexOffset(decl) +
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
