import {
  report,
  ruleMessages,
  styleSearch,
  whitespaceChecker
} from "../../utils"

export const ruleName = "media-feature-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected whitespace after ":"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return mediaFeatureColonSpaceChecker(checker.after)
}

export function mediaFeatureColonSpaceChecker(checkLocation) {
  return function (css, result) {
    css.eachAtRule(function (atRule) {
      const params = atRule.params
      styleSearch({ source: params, target: ":" }, match => {
        checkColon(params, match.startIndex, atRule)
      })
    })

    function checkColon(source, index, node) {
      checkLocation({ source, index, err: m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        }),
      })
    }
  }
}
