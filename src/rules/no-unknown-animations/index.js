const declarationValueIndex = require("../../utils/declarationValueIndex")
const findAnimationName = require("../../utils/findAnimationName")
const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
import { animationNameKeywords } from "../../reference/keywordSets"

export const ruleName = "no-unknown-animations"

export const messages = ruleMessages(ruleName, {
  rejected: animationName => `Unexpected unknown animation name "${animationName}"`,
})

module.exports = function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) {
      return
    }

    const declaredAnimations = new Set()
    root.walkAtRules(/(-(moz|webkit)-)?keyframes/i, atRule => {
      declaredAnimations.add(atRule.params)
    })

    root.walkDecls(decl => {
      if (decl.prop.toLowerCase() === "animation" || decl.prop.toLowerCase() === "animation-name") {
        const animationNames = findAnimationName(decl.value)

        if (animationNames.length === 0) {
          return
        }

        animationNames.forEach(animationNameNode => {
          if (animationNameKeywords.has(animationNameNode.value.toLowerCase())) {
            return
          }
          if (declaredAnimations.has(animationNameNode.value)) {
            return
          }

          report({
            result,
            ruleName,
            message: messages.rejected(animationNameNode.value),
            node: decl,
            index: declarationValueIndex(decl) + animationNameNode.sourceIndex,
          })
        })
      }
    })
  }
}
