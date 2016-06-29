import {
  isStandardSyntaxValue,
  isVariable,
} from "./"
import {
  listStyleImageKeywords,
  listStylePositionKeywords,
  listStyleTypeKeywords,
} from "../reference/keywordSets"
import postcssValueParser from "postcss-value-parser"

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
    && listStyleTypeKeywords.has(valueNodes.nodes[0].value.toLowerCase())
  ) {
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
    if (listStylePositionKeywords.has(valueLowerCase) || listStyleImageKeywords.has(valueLowerCase)) { return }

    listStyleTypes.push(valueNode)
  })

  return listStyleTypes
}
