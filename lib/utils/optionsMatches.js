"use strict"

const matchesStringOrRegExp = require("./matchesStringOrRegExp")

/**
 * Check if an options object's propertyName contains a user-defined string or
 * regex that matches the passed in input.
 *
 * @param {object} options
 * @param {string} propertyName - The haystack name
 * @param {string} input - The needle
 * @return {boolean} If `true`, a match was found
 */
module.exports = function optionsMatches(options, propertyName, input) {
  return !!(options && options[propertyName] && typeof input === "string" && matchesStringOrRegExp(input.toLowerCase(), options[propertyName]))
}
