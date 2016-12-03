/* @flow */
"use strict"

const hasInterpolation = require("../utils/hasInterpolation")
/**
 * Check whether a value is standard
 */
module.exports = function (value/*: string*/)/*: boolean*/ {
  // SCSS variable
  if (value[0] === "$") {
    return false
  }

  // Less variable
  if (value[0] === "@") {
    return false
  }

  // SCSS or Less interpolation
  if (hasInterpolation(value)) {
    return false
  }

  return true
}
