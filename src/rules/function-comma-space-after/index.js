import valueParser from "postcss-value-parser"
import {
  declarationValueIndexOffset,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "function-comma-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ","`,
  rejectedAfter: () => `Unexpected whitespace after ","`,
  expectedAfterSingleLine: () => `Expected single space after "," in a single-line list`,
  rejectedAfterSingleLine: () => `Unexpected whitespace after "," in a single-line list`,
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
    const functionOffset = declarationValueIndexOffset(decl)

    const cssFunctions = valueParser(decl.value)
      .nodes
      .filter(node => node.type === "function")

    cssFunctions.forEach(cssFunction => {
      const cssFunctionString = valueParser.stringify(cssFunction)
      styleSearch({ source: cssFunctionString, target: "," }, match => {
        locationChecker({
          source: cssFunctionString,
          index: match.startIndex,
          err: message => {
            report({
              message,
              node: decl,
              index: functionOffset + cssFunction.sourceIndex + match.startIndex,
              result,
              ruleName: checkedRuleName,
            })
          },
        })
      })
    })
  })
}
