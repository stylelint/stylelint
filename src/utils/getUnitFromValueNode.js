import blurInterpolation from "./blurInterpolation"
import { isFinite } from "lodash"
import isStandardSyntaxValue from "./isStandardSyntaxValue"
import valueParser from "postcss-value-parser"

/**
 * Get unit from value node
 *
 * Returns `null` if the unit is not found.
 *
 * @param {node} node
 * @return {string|null}
 */
export default function (node) {
  if (!node || (node && !node.value)) { return null }

  const value = blurInterpolation(node.value, "")
    // ignore hack unit
    .replace("\\0", "")
    .replace("\\9", "")

  if (node.type !== "word"
    || !isStandardSyntaxValue(value)
    || !isFinite(parseInt(value))
    || node.value[0] === "#"
  ) { return null }

  const parsedUnit = valueParser.unit(value)

  if (!parsedUnit) { return null }

  return parsedUnit.unit
}
