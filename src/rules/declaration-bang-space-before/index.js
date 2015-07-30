import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { declarationBangSpaceChecker } from "../declaration-bang-space-after"

export const ruleName = "declaration-bang-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before "!"`,
  rejectedBefore: () => `Unexpected whitespace before "!"`,
})

/**
 * @param {"always"|"never"} expectation
 */
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

    declarationBangSpaceChecker(checker.before, root, result)
  }
}
