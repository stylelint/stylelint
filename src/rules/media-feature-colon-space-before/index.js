import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { mediaFeatureColonSpaceChecker } from "../media-feature-colon-space-after"

export const ruleName = "media-feature-colon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":"`,
  rejectedBefore: () => `Unexpected whitespace before ":"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return mediaFeatureColonSpaceChecker(checker.before)
}
