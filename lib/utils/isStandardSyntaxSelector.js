"use strict"

const hasInterpolation = require("../utils/hasInterpolation")
/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @return {boolean} If `true`, the selector is standard
 */
module.exports = function (selector) {
  // SCSS or Less interpolation
  if (hasInterpolation(selector)) {
    return false
  }

  // SCSS placeholder selectors
  if (selector.indexOf("%") === 0) {
    return false
  }

  return true
}
