/* @flow */
"use strict"

const hasInterpolation = require("../utils/hasInterpolation")
/**
 * Check whether a selector is standard
 */
module.exports = function (selector/*: string*/)/*: boolean*/ {
  // SCSS or Less interpolation
  if (hasInterpolation(selector)) {
    return false
  }

  // SCSS placeholder selectors
  if (selector.indexOf("%") === 0) {
    return false
  }

  // Less :extend()
  if ((/\:extend(\(.*?\))?/).test(selector)) {
    return false
  }

  return true
}
