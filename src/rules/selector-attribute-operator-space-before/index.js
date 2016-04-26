import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

import { selectorAttributeOperatorSpaceChecker } from "../selector-attribute-operator-space-after"

export const ruleName = "selector-attribute-operator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: (operator) => `Expected single space before "${operator}"`,
  rejectedBefore: (operator) => `Unexpected whitespace before "${operator}"`,
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

    selectorAttributeOperatorSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      checkBeforeOperator: true,
    })
  }
}
