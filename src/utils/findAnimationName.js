import postcss from "postcss"
import postcssValueParser from "postcss-value-parser"
import {
  isStandardValue,
  isVariable,
} from "./"

// cf. https://developer.mozilla.org/en-US/docs/Web/CSS/animation
const animationShorthandKeywords = new Set([
  "infinite", "normal", "reverse", "alternate", "alternate-reverse",
  "none", "initial", "inherit", "unset", "forwards", "backwards", "both", "running", "paused",
  "linear", "ease", "ease-in", "ease-out", "ease-in-out", "step-start", "step-end",
])

/**
 * Get the names and indexes of position animation name
 *
 * @param {string} value
 * @return {object} Object with name and index of position
 */
export default function findAnimationName(value) {
  const valueList = postcss.list.space(value)
  const animationNames = []
  let index = -1

  for (const value of valueList) {
    index++
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

    animationNames.push({
      name: value,
      index,
    })
  }

  return animationNames
}
