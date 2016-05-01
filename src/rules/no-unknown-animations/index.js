import postcss from "postcss"
import postcssValueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  isStandardValue,
  isVariable,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-unknown-animations"

export const messages = ruleMessages(ruleName, {
  rejected: animationName => `Unknown animation name "${animationName}"`,
})

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
const animationShorthandKeywords = new Set([
  "infinite", "normal", "reverse", "alternate", "alternate-reverse",
  "none", "initial", "inherit", "unset", "forwards", "backwards", "both", "running", "paused",
  "linear", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
])

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
        const valueList = postcss.list.space(decl.value)
        for (const value of valueList) {
          // Ignore non standard syntax
          if (!isStandardValue(value)) { continue }
          // Ignore variables
          if (isVariable(value)) { continue }
          // Ignore numbers with units
          if (postcssValueParser.unit(value)) { continue }
          // Ignore keywords for other animation parts
          if (animationShorthandKeywords.has(value)) { continue }
          // Ignore functions
          if (value.indexOf("(") !== -1) { continue }
          checkAnimationName(value, decl, decl.value.indexOf(value))
        }
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
