"use strict"

/**
 * Check whether a media query is a custom
 *
 * @param {string} mediaQuery
 * @return {boolean} If `true`, media query is a custom
 */
module.exports = function (mediaQuery) {
  return mediaQuery.slice(0, 2) === "--"
}
