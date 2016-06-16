import postcssValueParser from "postcss-value-parser"
import {
  isStandardSyntaxValue,
  isVariable,
  isValidFontSize,
} from "./"
import {
  basicKeywords,
  fontFamilyKeywords,
  fontShorthandKeywords,
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
  if (valueNodes.nodes.length === 1 && basicKeywords.has(valueNodes.nodes[0].value.toLowerCase())) {
    return [valueNodes.nodes[0]]
  }

  let needMergeNodesByValue = false
  let mergeCharacters = null

  valueNodes.walk((valueNode, index, nodes) => {
    if (valueNode.type === "function") { return false }
    if (!nodeTypesToCheck.has(valueNode.type)) { return }

    const valueLowerCase = valueNode.value.toLowerCase()

    // Ignore non standard syntax
    if (!isStandardSyntaxValue(valueLowerCase)) { return }

    // Ignore variables
    if (isVariable(valueLowerCase)) { return }

    // Ignore keywords for other font parts
    if (fontShorthandKeywords.has(valueLowerCase) && !fontFamilyKeywords.has(valueLowerCase)) { return }

    // Ignore font-sizes
    if (isValidFontSize(valueNode.value)) { return }

    // Ignore anything come after a <font-size>/, because it's a line-height
    if (nodes[index - 1] && nodes[index - 1].value === "/"
      && nodes[index - 2] && isValidFontSize(nodes[index - 2].value)) { return }

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
