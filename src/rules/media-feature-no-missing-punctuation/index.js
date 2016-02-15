import execall from "execall"
import {
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "media-feature-no-missing-punctuation"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected missing punctuation within non-boolean media feature",
})

const PUNCTUATION = [ ":", "=", ">", ">=", "<", "<=" ]

function isPunctuation(str) {
  return PUNCTUATION.indexOf(str) !== -1
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

    root.walkAtRules("media", atRule => {
      execall(/\((.*?)\)/g, atRule.params).forEach(mediaFeatureMatch => {
        const splitMediaFeature = mediaFeatureMatch.sub[0].trim().split(/\s+/)
        if (splitMediaFeature.length === 1) { return }

        // Ignore the last one
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
            index: mediaQueryParamIndexOffset(atRule) + mediaFeatureMatch.index,
          })
        }
      })
    })
  }
}
