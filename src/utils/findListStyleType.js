import postcssValueParser from "postcss-value-parser"
import {
  isStandardValue,
  isVariable,
} from "./"
import {
  listStyleTypeKeywords,
  listStylePositionKeywords,
  listStyleImageKeywords,
} from "../reference/keywordSets"

/**
 * Get the list-style-type within a `list-style` shorthand property value.
 *
 * @param {string} value
 * @return {object} Collection list-style-type nodes
 */
export default function findListStyleType(value) {
  const listStyleTypes = []

  const valueNodes = postcssValueParser(value)

  // Handle `inherit`, `initial` and etc
  if (valueNodes.nodes.length === 1
    && listStyleTypeKeywords.has(valueNodes.nodes[0].value)
  ) {
    return [valueNodes.nodes[0]]
  }

  valueNodes.walk((valueNode) => {
    if (valueNode.type === "function") { return false }
    if (valueNode.type !== "word") { return }

    const value = valueNode.value

    // Ignore non standard syntax
    if (!isStandardValue(value)) { return }
    // Ignore variables
    if (isVariable(value)) { return }
    // Ignore keywords for other font parts
    if (listStylePositionKeywords.has(value) || listStyleImageKeywords.has(value)) { return }

    listStyleTypes.push(valueNode)
  })

  return listStyleTypes
}

