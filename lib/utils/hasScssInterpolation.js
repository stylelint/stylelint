"use strict"

/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has scss interpolation
 */
module.exports = function (string) {
  if (/#{.+?}/.test(string)) {
    return true
  }

  return false
}
