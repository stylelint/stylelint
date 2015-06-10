import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { mediaFeatureColonSpaceChecker } from "../media-feature-colon-space-after"

export const ruleName = "media-feature-colon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":" in media feature`,
  rejectedBefore: () => `Unexpected space before ":" in media feature`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return mediaFeatureColonSpaceChecker(checker.before)
}
