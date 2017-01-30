"use strict"

const atRuleParamIndex = require("../../utils/atRuleParamIndex")
const isStandardSyntaxMediaFeature = require("../../utils/isStandardSyntaxMediaFeature")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const execall = require("execall")
const punctuationSets = require("../../reference/punctuationSets")

const ruleName = "media-feature-no-missing-punctuation"

const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing punctuation",
})

function isPunctuation(str) {
  return punctuationSets.mediaFeaturePunctuation.has(str)
}

function endsWithPunctuation(str) {
  return isPunctuation(str.slice(-1)) || isPunctuation(str.slice(-2))
}

function startsWithPunctuation(str) {
  return isPunctuation(str[0]) || isPunctuation(str.slice(0, 2))
}

const rule = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    result.warn((
      "'media-feature-no-missing-punctuation' has been deprecated and in 8.0 will be removed."
    ), {
      stylelintType: "deprecation",
      stylelintReference: "https://stylelint.io/user-guide/rules/media-feature-no-missing-punctuation/",
    })

    root.walkAtRules(/^media$/i, atRule => {
      execall(/\((.*?)\)/g, atRule.params).forEach(mediaFeatureMatch => {
        if (!isStandardSyntaxMediaFeature(mediaFeatureMatch.match)) {
          return
        }

        const splitMediaFeature = mediaFeatureMatch.sub[0].trim().split(/\s+/)
        if (splitMediaFeature.length === 1) {
          return
        }

        // Ignore the last one
        for (let i = 0, l = splitMediaFeature.length - 1; i < l; i++) {
          const mediaFeaturePart = splitMediaFeature[i]

          // This part is valid if it is punctuation,
          // it ends with punctuation,
          // the next part is punctuation,
          // or the next part begins with punctuation
          if (isPunctuation(mediaFeaturePart)) {
            continue
          }
          if (endsWithPunctuation(mediaFeaturePart)) {
            continue
          }
          const nextPart = splitMediaFeature[i + 1]
          if (isPunctuation(nextPart)) {
            continue
          }
          if (startsWithPunctuation(nextPart)) {
            continue
          }

          return report({
            result,
            ruleName,
            message: messages.rejected,
            node: atRule,
            index: atRuleParamIndex(atRule) + mediaFeatureMatch.index,
          })
        }
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
