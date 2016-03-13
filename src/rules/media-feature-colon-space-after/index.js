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
  expectedAfter: () => "Expected single space after \":\"",
  rejectedAfter: () => "Unexpected whitespace after \":\"",
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

    mediaFeatureColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function mediaFeatureColonSpaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkAtRules(atRule => {
    const { name, params } = atRule

    // Only deal with @media at-rules
    if (name !== "media") { return }

    styleSearch({ source: params, target: ":" }, match => {
      checkColon(params, match.startIndex, atRule)
    })
  })

  function checkColon(source, index, node) {
    locationChecker({ source, index, err: m =>
      report({
        message: m,
        node,
        index: index + mediaQueryParamIndexOffset(node),
        result,
        ruleName: checkedRuleName,
      }),
    })
  }
}
