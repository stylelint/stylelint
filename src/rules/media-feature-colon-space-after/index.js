import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "media-feature-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected whitespace after ":"`,
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

    mediaFeatureColonSpaceChecker(checker.after, root, result)
  }
}

export function mediaFeatureColonSpaceChecker(checkLocation, root, result) {
  root.eachAtRule(atRule => {
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
