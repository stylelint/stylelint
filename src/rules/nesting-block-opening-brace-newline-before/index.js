import {
  cssStatementHasEmptyBlock,
  cssStatementIsNestingBlock,
  cssStatementStringBeforeBlock,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "nesting-block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before "{"`,
  expectedBeforeSingleLine: () => `Expected newline before "{" of a single-line nesting block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line nesting block`,
  expectedBeforeMultiLine: () => `Expected newline before "{" of a multi-line nesting block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line nesting block`,
})

/**
 * @param {"always"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    })

    checkNestingBlockOpeningBraceBefore(checker, root, result)
  }
}

export function checkNestingBlockOpeningBraceBefore(checker, root, result) {
  root.eachRule(rule => {
    if (!cssStatementIsNestingBlock(rule) || cssStatementHasEmptyBlock(rule)) { return }

    // console.log(JSON.stringify(rule.toString()))

    const beforeBrace = cssStatementStringBeforeBlock(rule)
    const lineCheckStr = rule.toString().slice(beforeBrace.length)
    checker.beforeAllowingIndentation({
      lineCheckStr,
      source: beforeBrace,
      index: beforeBrace.length,
      err: m => {
        report({
          message: m,
          node: rule,
          result,
          ruleName,
        })
      },
    })
  })
}
