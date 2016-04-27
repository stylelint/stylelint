import {
  declarationValueIndex,
  findAnimationName,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-unknown-animations"

export const messages = ruleMessages(ruleName, {
  rejected: animationName => `Unknown animation name "${animationName}"`,
})

const animationNameKeywords = new Set([
  "none", "initial", "inherit", "unset",
])

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    const declaredAnimations = new Set()
    root.walkAtRules("keyframes", atRule => {
      declaredAnimations.add(atRule.params)
    })

    root.walkDecls(decl => {
      if (decl.prop === "animation-name" && !animationNameKeywords.has(decl.value)) {
        checkAnimationName(decl.value, decl)
      }

      if (decl.prop === "animation") {
        const animationNames = findAnimationName(decl.value)

        if (animationNames.length === 0) { return }

        animationNames.forEach(
          (animation) => checkAnimationName(animation.name, decl, decl.value.indexOf(animation.name))
        )
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
