import postcssValueParser from "postcss-value-parser"
import {
  getUnitFromValueNode,
  isStandardValue,
  isVariable,
} from "./"
import {
  basicKeywords,
  fontStyleKeywords,
  fontVariantKeywords,
  fontWeightKeywords,
  fontStretchKeywords,
  fontSizeKeywords,
  lineHeightKeywords,
} from "../reference/keywordSets"

const nodeTypesToCheck = new Set([
  "word",
  "string",
  "space",
  "div",
])

function joinValueNodes(firstNode, secondNode, charactersBetween) {
  firstNode.value = firstNode.value + charactersBetween + secondNode.value

  return firstNode
}

/**
 * Get the font-families within a `font` shorthand property value.
 *
 * @param {string} value
 * @return {object} Collection font-family nodes
 */
export default function findFontFamily(value) {
  const fontFamilies = []

  const valueNodes = postcssValueParser(value)

  // Handle `inherit`, `initial` and etc
  if (valueNodes.nodes.length === 1 && basicKeywords.has(valueNodes.nodes[0].value)) {
    return [valueNodes.nodes[0]]
  }

  let needMergeNodesByValue = false
  let mergeCharacters = null

  valueNodes.walk((valueNode) => {
    if (valueNode.type === "function") { return false }
    if (!nodeTypesToCheck.has(valueNode.type)) { return }

    const value = valueNode.value

    // Ignore non standard syntax
    if (!isStandardValue(value)) { return }
    // Ignore variables
    if (isVariable(value)) { return }
    // Ignore keywords for other font parts
    if (fontStyleKeywords.has(value)
      || fontVariantKeywords.has(value)
      || fontWeightKeywords.has(value)
      || fontStretchKeywords.has(value)
      || fontSizeKeywords.has(value)
      || lineHeightKeywords.has(value)
    ) { return }
    // Ignore numbers with units
    const unit = getUnitFromValueNode(valueNode)
    if (unit && /[a-z%]/i.test(unit)) { return }
    // Detect when a space or comma is dividing a list of font-families, and save the joining character.
    if ((valueNode.type === "space" || (valueNode.type === "div" && valueNode.value !== ","))
      && fontFamilies.length !== 0
    ) {
      needMergeNodesByValue = true
      mergeCharacters = valueNode.value

      return
    } else if (valueNode.type === "space" || valueNode.type === "div") {
      return
    }

    const fontFamily = valueNode

    if (needMergeNodesByValue) {
      joinValueNodes(fontFamilies[fontFamilies.length - 1], valueNode, mergeCharacters)
      needMergeNodesByValue = false
      mergeCharacters = null
    } else {
      fontFamilies.push(fontFamily)
    }
  })

  return fontFamilies
}
