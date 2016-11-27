import { atRuleParamIndex, isCustomMediaQuery, isRangeContextMediaFeature, isStandardSyntaxMediaFeatureName, matchesStringOrRegExp, report, ruleMessages, validateOptions } from "../../utils"
import { isString } from "lodash"
import mediaParser from "postcss-media-query-parser"

export const ruleName = "media-feature-name-blacklist"

export const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected media feature name "${name}"`,
})

export default function (blacklist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: blacklist,
      possible: [isString],
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

        if (!matchesStringOrRegExp(value.toLowerCase(), blacklist)) {
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
