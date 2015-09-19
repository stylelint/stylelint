import {
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "media-feature-colon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ":"`,
  rejectedAfter: () => `Unexpected whitespace after ":"`,
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

    mediaFeatureColonSpaceChecker(checker.after, root, result)
  }
}

export function mediaFeatureColonSpaceChecker(checkLocation, root, result) {
  root.walkAtRules(atRule => {
    const { name, params } = atRule

    // Only deal with @media at-rules
    if (name !== "media") { return }

    styleSearch({ source: params, target: ":" }, match => {
      checkColon(params, match.startIndex, atRule)
    })
  })

  function checkColon(source, index, node) {
    checkLocation({ source, index, err: m =>
      report({
        message: m,
        node,
        index: index + mediaQueryParamIndexOffset(node),
        result,
        ruleName,
      }),
    })
  }
}
