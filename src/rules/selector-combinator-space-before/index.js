import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

import { selectorCombinatorSpaceChecker } from "../selector-combinator-space-after"

export const ruleName = "selector-combinator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: c => `Expected single space before "${c}" combinator`,
  rejectedBefore: c => `Unexpected whitespace before "${c}" combinator`,
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    selectorCombinatorSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
    })
  }
}
