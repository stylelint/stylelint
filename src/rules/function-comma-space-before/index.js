import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { functionCommaSpaceChecker } from "../function-comma-space-after"

export const ruleName = "function-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected whitespace before ","`,
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })

    functionCommaSpaceChecker(checker.before, root, result)
  }
}
