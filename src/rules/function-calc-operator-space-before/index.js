import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { functionCalcOperatorSpaceChecker } from "../function-calc-operator-space-after"

export const ruleName = "function-calc-operator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before operator within calc function`,
  rejectedBefore: () => `Unexpected space before operator within calc function`,
})
/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return functionCalcOperatorSpaceChecker(checker.before)
}
