"use strict"

const hasInterpolation = require("../utils/hasInterpolation")
/**
 * Check whether a property is standard
 *
 * @param {string} property
 * @return {boolean} If `true`, the property is standard
 */
module.exports = function (property) {
  // SCSS var (e.g. $var: x), list (e.g. $list: (x)) or map (e.g. $map: (key:value))
  if (property[0] === "$") {
    return false
  }

  // Less var (e.g. @var: x)
  if (property[0] === "@") {
    return false
  }

  // SCSS or Less interpolation
  if (hasInterpolation(property)) {
    return false
  }

  return true
}
