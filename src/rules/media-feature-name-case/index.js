import {
  atRuleParamIndex,
  isStandardSyntaxMediaFeatureName,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import mediaParser from "postcss-media-query-parser"

export const ruleName = "media-feature-name-case"

export const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "lower",
        "upper",
      ],
    })
    if (!validOptions) { return }

    root.walkAtRules(/^media$/i, atRule => {
      mediaParser(atRule.params).walk(/^media-feature$/i, mediaFeatureNode => {
        if (!isStandardSyntaxMediaFeatureName(mediaFeatureNode.value)) { return }

        const mediaFeatureName = mediaFeatureNode.value

        const expectedFeatureName = expectation === "lower"
          ? mediaFeatureName.toLowerCase()
          : mediaFeatureName.toUpperCase()

        if (mediaFeatureName === expectedFeatureName) { return }

        report({
          index: atRuleParamIndex(atRule) + mediaFeatureNode.sourceIndex,
          message: messages.expected(mediaFeatureName, expectedFeatureName),
          node: atRule,
          ruleName,
          result,
        })
      })
    })
  }
}
