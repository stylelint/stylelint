import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { declarationColonSpaceChecker } from "../declaration-colon-space-after"

export const ruleName = "declaration-colon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":"`,
  rejectedBefore: () => `Unexpected whitespace before ":"`,
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

    declarationColonSpaceChecker(checker.before, root, result)
  }
}
