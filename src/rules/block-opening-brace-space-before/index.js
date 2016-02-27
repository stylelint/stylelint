import { isString } from "lodash"

import {
  cssStatementBlockString,
  cssStatementHasBlock,
  cssStatementHasEmptyBlock,
  cssStatementStringBeforeBlock,
  matchesStringOrRegExp,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-opening-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"{\"",
  rejectedBefore: () => "Unexpected whitespace before \"{\"",
  expectedBeforeSingleLine: () => "Expected single space before \"{\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \"{\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected single space before \"{\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected whitespace before \"{\" of a multi-line block",
})

export default function (expectation, options) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    }, {
      actual: options,
      possible: {
        ignoreAtRules: [isString],
      },
      optional: true,
    })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      // Return early if blockless or has an empty block
      if (!cssStatementHasBlock(statement) || cssStatementHasEmptyBlock(statement)) { return }

      // Return early if at-rule is to be ignored
      if (cssStatementIsIgnoredAtRule(statement, options)) { return }

      const source = cssStatementStringBeforeBlock(statement)

      checker.before({
        source,
        index: source.length,
        lineCheckStr: cssStatementBlockString(statement),
        err: m => {
          report({
            message: m,
            node: statement,
            index: cssStatementStringBeforeBlock(statement, { noBefore: true }).length - 1,
            result,
            ruleName,
          })
        },
      })
    }
  }
}

export function cssStatementIsIgnoredAtRule(statement, options) {
  return (
    options &&
    options.ignoreAtRules &&
    statement.type === "atrule" &&
    matchesStringOrRegExp(statement.name, options.ignoreAtRules)
  )
}
