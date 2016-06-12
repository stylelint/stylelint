import styleSearch from "style-search"
import {
  atRuleParamIndex,
  report,
  ruleMessages,
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
  root.walkAtRules(/^media$/i, atRule => {
    const { params } = atRule

    styleSearch({ source: params, target: ":" }, match => {
      checkColon(params, match.startIndex, atRule)
    })
  })

  function checkColon(source, index, node) {
    locationChecker({ source, index, err: m =>
      report({
        message: m,
        node,
        index: index + atRuleParamIndex(node),
        result,
        ruleName: checkedRuleName,
      }),
    })
  }
}
