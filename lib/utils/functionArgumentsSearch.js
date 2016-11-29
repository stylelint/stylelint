"use strict"

const balancedMatch = require("balanced-match")
const styleSearch = require("style-search")

/**
 * Search a CSS string for functions by name.
 * For every match, invoke the callback, passing the function's
 * "argument(s) string" (whatever is inside the parentheses)
 * as an argument.
 *
 * @param {string} source
 * @param {string} functionName - e.g. calc, color, rgba
 * @param {function} callback - Will be called once for every
 *   matching function found, with the function's "argument(s) string"
 *   and its starting index as the arguments
 */
module.exports = function (source, functionName, callback) {
  styleSearch({
    source,
    target: functionName,
    functionNames: "check",
  }, match => {
    if (source[match.endIndex] !== "(") {
      return
    }
    const parensMatch = balancedMatch("(", ")", source.substr(match.startIndex))
    callback(parensMatch.body, match.endIndex + 1)
  })
}
