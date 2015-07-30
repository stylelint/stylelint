import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { checkNestingBlockOpeningBraceBefore } from "../nesting-block-opening-brace-newline-before"

export const ruleName = "nesting-block-opening-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before "{"`,
  rejectedBefore: () => `Unexpected whitespace before "{"`,
  expectedBeforeSingleLine: () => `Expected single space before "{" of a single-line nesting block`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "{" of a single-line nesting block`,
  expectedBeforeMultiLine: () => `Expected single space before "{" of a multi-line nesting block`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "{" of a multi-line nesting block`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    })

    checkNestingBlockOpeningBraceBefore(checker, root, result)
  }
}
