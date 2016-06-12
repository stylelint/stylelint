import postcssValueParser from "postcss-value-parser"
import {
  getUnitFromValueNode,
  isStandardSyntaxValue,
  isVariable,
} from "./"
import {
  basicKeywords,
  animationShorthandKeywords,
} from "../reference/keywordSets"

/**
 * Get the font-families within a `font` shorthand property value.
 *
 * @param {string} value
 * @return {object} Collection font-family nodes
 */
export default function findAnimationName(value) {
  const animationNames = []

  const valueNodes = postcssValueParser(value)

  // Handle `inherit`, `initial` and etc
  if (valueNodes.nodes.length === 1 && basicKeywords.has(valueNodes.nodes[0].value.toLowerCase())) {
    return [valueNodes.nodes[0]]
  }

  valueNodes.walk((valueNode) => {
    if (valueNode.type === "function") { return false }
    if (valueNode.type !== "word") { return }

    const valueLowerCase = valueNode.value.toLowerCase()

    // Ignore non standard syntax
    if (!isStandardSyntaxValue(valueLowerCase)) { return }
    // Ignore variables
    if (isVariable(valueLowerCase)) { return }
    // Ignore keywords for other font parts
    if (animationShorthandKeywords.has(valueLowerCase)) { return }
    // Ignore numbers with units
    const unit = getUnitFromValueNode(valueNode)
    if (unit || unit === "") { return }

    animationNames.push(valueNode)
  })

  return animationNames
}
