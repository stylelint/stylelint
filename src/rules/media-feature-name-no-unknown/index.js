const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const isCustomMediaQuery = require("../../utils/isCustomMediaQuery")
const isRangeContextMediaFeature = require("../../utils/isRangeContextMediaFeature")
const isStandardSyntaxMediaFeatureName = require("../../utils/isStandardSyntaxMediaFeatureName")
const optionsMatches = require("../../utils/optionsMatches")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const keywordSets = require("../../reference/keywordSets")
const mediaParser = require("postcss-media-query-parser")
import { vendor } from "postcss"

export const ruleName = "media-feature-name-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: mediaFeatureName => `Unexpected unknown media feature name "${mediaFeatureName}"`,
})

module.exports = function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreMediaFeatureNames: [_.isString],
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

        if (vendor.prefix(value) || keywordSets.mediaFeatureNames.has(value.toLowerCase())) {
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
