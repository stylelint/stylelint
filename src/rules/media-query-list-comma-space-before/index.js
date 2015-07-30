import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { mediaQueryListCommaWhitespaceChecker } from "../media-query-list-comma-space-after"

export const ruleName = "media-query-list-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected whitespace before ","`,
  expectedBeforeSingleLine: () => `Expected single space before "," in a single-line list`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "," in a single-line list`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
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
      ],
    })

    mediaQueryListCommaWhitespaceChecker(checker.before, root, result)
  }
}
