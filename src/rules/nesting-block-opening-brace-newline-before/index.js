import {
  cssStatementHasEmptyBlock,
  cssStatementIsNestingBlock,
  cssStatementStringBeforeBlock,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "nesting-block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "{"`,
  expectedBeforeSingleLine: () => `Expected newline before "{" of a single-line nesting block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line nesting block`,
  expectedBeforeMultiLine: () => `Expected newline before "{" of a multi-line nesting block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line nesting block`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    checkNestingBlockOpeningBraceBefore({
      root,
      result,
      locationChecker: whitespaceChecker("newline", expectation, messages),
      checkedRuleName: ruleName,
    })
  }
}

export function checkNestingBlockOpeningBraceBefore({ locationChecker, root, result, checkedRuleName }) {
  root.walkRules(rule => {
    if (!cssStatementIsNestingBlock(rule) || cssStatementHasEmptyBlock(rule)) { return }

    // console.log(JSON.stringify(rule.toString()))

    const beforeBrace = cssStatementStringBeforeBlock(rule)
    const lineCheckStr = rule.toString().slice(beforeBrace.length)
    locationChecker.beforeAllowingIndentation({
      lineCheckStr,
      source: beforeBrace,
      index: beforeBrace.length,
      err: m => {
        report({
          message: m,
          node: rule,
          result,
          ruleName: checkedRuleName,
        })
      },
    })
  })
}
