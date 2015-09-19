import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
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

export default function (expectation) {
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
    })
    if (!validOptions) { return }

    checkNestingBlockOpeningBraceBefore({
      root,
      result,
      locationChecker: whitespaceChecker("space", expectation, messages),
      checkedRuleName: ruleName,
    })
  }
}
