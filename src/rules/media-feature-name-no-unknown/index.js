import { atRuleParamIndex, isCustomMediaQuery, isRangeContextMediaFeature, isStandardSyntaxMediaFeatureName, optionsMatches, report, ruleMessages, validateOptions } from "../../utils"
import { isString } from "lodash"
import { mediaFeatureNames } from "../../reference/keywordSets"
import mediaParser from "postcss-media-query-parser"
import { vendor } from "postcss"

export const ruleName = "media-feature-name-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: mediaFeatureName => `Unexpected unknown media feature name "${mediaFeatureName}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreMediaFeatureNames: [isString],
      },
      optional: true,
    })

    if (!validOptions) {
      return
    }

    root.walkAtRules(/^media$/i, atRule => {
      mediaParser(atRule.params).walk(/^media-feature$/i, mediaFeatureNode => {
        const parent = mediaFeatureNode.parent,
          sourceIndex = mediaFeatureNode.sourceIndex,
          value = mediaFeatureNode.value

        if (isRangeContextMediaFeature(parent.value) || !isStandardSyntaxMediaFeatureName(value) || isCustomMediaQuery(value)) {
          return
        }

        if (optionsMatches(options, "ignoreMediaFeatureNames", value)) {
          return
        }

        if (vendor.prefix(value) || mediaFeatureNames.has(value.toLowerCase())) {
          return
        }

        report({
          index: atRuleParamIndex(atRule) + sourceIndex,
          message: messages.rejected(value),
          node: atRule,
          ruleName,
          result,
        })
      })
    })
  }
}
