import {
  declarationValueIndex,
  findAnimationName,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import {
  animationNameKeywords,
  basicKeywords,
} from "../../reference/keywordSets"

export const ruleName = "no-unknown-animations"

export const messages = ruleMessages(ruleName, {
  rejected: animationName => `Unexpected unknown animation name "${animationName}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const declaredAnimations = new Set()
    root.walkAtRules(/keyframes/i, atRule => {
      declaredAnimations.add(atRule.params)
    })

    root.walkDecls(decl => {
      if (decl.prop.toLowerCase() === "animation-name"
        && !animationNameKeywords.has(decl.value.toLowerCase())
      ) {
        checkAnimationName(decl.value, decl)
      }

      if (decl.prop.toLowerCase() === "animation") {
        const animationNames = findAnimationName(decl.value)
        if (animationNames.length === 0) { return }

        animationNames.forEach((animationNameNode) => {
          if (basicKeywords.has(animationNameNode.value.toLowerCase())) { return }

          checkAnimationName(animationNameNode.value, decl, animationNameNode.sourceIndex)
        })
      }
    })

    function checkAnimationName(animationName, decl, offset = 0) {
      if (declaredAnimations.has(animationName)) { return }
      report({
        result,
        ruleName,
        message: messages.rejected(animationName),
        node: decl,
        index: declarationValueIndex(decl) + offset,
      })
    }
  }
}
