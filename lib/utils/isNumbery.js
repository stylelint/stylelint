// Too weird for Flow
"use strict"

/**
 * Check whether it's a number or a number-like string:
 * i.e. when coerced to a number it == itself.
 */
module.exports = function (value) {
  return value.trim().length !== 0 && Number(value) == value
}
