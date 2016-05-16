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
import {
  animationShorthandKeywords,
  animationNameKeywords,
} from "../../reference/keywordSets"

export const ruleName = "no-unknown-animations"

export const messages = ruleMessages(ruleName, {
  rejected: animationName => `Unknown animation name "${animationName}"`,
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
        const valueList = postcss.list.space(decl.value)
        for (const value of valueList) {
          // Ignore non standard syntax
          if (!isStandardValue(value)) { continue }
          // Ignore variables
          if (isVariable(value)) { continue }
          // Ignore numbers with units
          if (postcssValueParser.unit(value)) { continue }
          // Ignore keywords for other animation parts
          if (animationShorthandKeywords.has(value.toLowerCase())) { continue }
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
