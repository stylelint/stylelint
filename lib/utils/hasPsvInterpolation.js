"use strict"

/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has postcss-simple-vars interpolation
 */
module.exports = function (string) {
  if (/\$\(.+?\)/.test(string)) {
    return true
  }

  return false
}
