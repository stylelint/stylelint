const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const isCustomMediaQuery = require("../../utils/isCustomMediaQuery")
const isRangeContextMediaFeature = require("../../utils/isRangeContextMediaFeature")
const isStandardSyntaxMediaFeatureName = require("../../utils/isStandardSyntaxMediaFeatureName")
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const _ = require("lodash")
const mediaParser = require("postcss-media-query-parser")

export const ruleName = "media-feature-name-whitelist"

export const messages = ruleMessages(ruleName, {
  rejected: name => `Unexpected media feature name "${name}"`,
})

module.exports = function (whitelist) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: whitelist,
      possible: [_.isString],
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

        if (matchesStringOrRegExp(value.toLowerCase(), whitelist)) {
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
