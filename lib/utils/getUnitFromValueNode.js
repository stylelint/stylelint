"use strict"

const blurInterpolation = require("./blurInterpolation")
const _ = require("lodash")
const isStandardSyntaxValue = require("./isStandardSyntaxValue")
const valueParser = require("postcss-value-parser")

/**
 * Get unit from value node
 *
 * Returns `null` if the unit is not found.
 *
 * @param {node} node
 * @return {string|null}
 */
module.exports = function (node) {
  if (!node || node && !node.value) {
    return null
  }

  const value = blurInterpolation(node.value, "")
  // ignore hack unit
  .replace("\\0", "").replace("\\9", "")
  // ignore decimal place
  .replace(".", "")

  if (node.type !== "word" || !isStandardSyntaxValue(value) || !_.isFinite(parseInt(value)) || node.value[0] === "#") {
    return null
  }

  const parsedUnit = valueParser.unit(value)

  if (!parsedUnit) {
    return null
  }

  return parsedUnit.unit
}
