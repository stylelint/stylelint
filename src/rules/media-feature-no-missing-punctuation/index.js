import {
  atRuleParamIndex,
  isStandardSyntaxMediaFeature,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { mediaFeaturePunctuation } from "../../reference/punctuationSets"
import mediaParser from "postcss-media-query-parser"

export const ruleName = "media-feature-no-missing-punctuation"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing punctuation",
})

function isPunctuation(str) {
  return mediaFeaturePunctuation.has(str)
}

function endsWithPunctuation(str) {
  return isPunctuation(str.slice(-1)) || isPunctuation(str.slice(-2))
}

function startsWithPunctuation(str) {
  return isPunctuation(str[0]) || isPunctuation(str.slice(0, 2))
}

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules(/^media$/i, atRule => {
      mediaParser(atRule.params).walk(/^media-feature$/i, mediaFeatureNode => {
        const parent = mediaFeatureNode.parent.value

        if (!isStandardSyntaxMediaFeature(parent)) { return }

        const splitMediaFeature = parent.slice(1, -1).trim().split(/\s+/)
        if (splitMediaFeature.length === 1) { return }

        for (let i = 0, l = splitMediaFeature.length - 1; i < l; i++) {
          const mediaFeaturePart = splitMediaFeature[i]

          // This part is valid if it is punctuation,
          // it ends with punctuation,
          // the next part is punctuation,
          // or the next part begins with punctuation
          if (isPunctuation(mediaFeaturePart)) { continue }
          if (endsWithPunctuation(mediaFeaturePart)) { continue }
          const nextPart = splitMediaFeature[i + 1]
          if (isPunctuation(nextPart)) { continue }
          if (startsWithPunctuation(nextPart)) { continue }

          return report({
            result,
            ruleName,
            message: messages.rejected,
            node: atRule,
            index: atRuleParamIndex(atRule) + mediaFeatureNode.sourceIndex - 1,
          })
        }
      })
    })
  }
}
