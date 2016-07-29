import {
  atRuleParamIndex,
  isRangeContextMediaFeature,
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

        const { parent, sourceIndex, value } = mediaFeatureNode

        if (isRangeContextMediaFeature(parent.value)) { return }
        if (!isStandardSyntaxMediaFeatureName(value)) { return }

        const expectedFeatureName = expectation === "lower"
          ? value.toLowerCase()
          : value.toUpperCase()

        if (value === expectedFeatureName) { return }

        report({
          index: atRuleParamIndex(atRule) + sourceIndex,
          message: messages.expected(value, expectedFeatureName),
          node: atRule,
          ruleName,
          result,
        })
      })
    })
  }
}
