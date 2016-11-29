const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")

import { mediaFeatureColonSpaceChecker } from "../media-feature-colon-space-after"

export const ruleName = "media-feature-colon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \":\"",
  rejectedBefore: () => "Unexpected whitespace before \":\"",
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    mediaFeatureColonSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
    })
  }
}
