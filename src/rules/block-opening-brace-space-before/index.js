import { isString } from "lodash"

import {
  blockString,
  hasBlock,
  hasEmptyBlock,
  beforeBlockString,
  optionsHaveIgnoredAtRule,
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
      if (!hasBlock(statement) || hasEmptyBlock(statement)) { return }

      // Return early if at-rule is to be ignored
      if (optionsHaveIgnoredAtRule(options, statement)) { return }

      const source = beforeBlockString(statement)
      const beforeBraceNoRaw = beforeBlockString(statement, { noRawBefore: true })

      let index = beforeBraceNoRaw.length - 1
      if (beforeBraceNoRaw[index - 1] === "\r") { index -= 1 }

      checker.before({
        source,
        index: source.length,
        lineCheckStr: blockString(statement),
        err: m => {
          report({
            message: m,
            node: statement,
            index,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
