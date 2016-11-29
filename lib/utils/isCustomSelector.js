"use strict"

/**
 * Check whether a selector is a custom one
 *
 * @param {string} selector
 * @return {boolean} If `true`, selector is a custom one
 */
module.exports = function (selector) {
  return (selector.slice(0, 3) === ":--")
}
