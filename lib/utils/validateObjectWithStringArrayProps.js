"use strict"

const _ = require("lodash")

/**
 * Check whether the variable is an object and all it's properties are arrays of string values:
 *
 * ignoreProperties = {
 *   value1: ["item11", "item12", "item13"],
 *   value2: ["item21", "item22", "item23"],
 *   value3: ["item31", "item32", "item33"],
 * }
 *
 * @param {object} value
 * @return {boolean} If `true`, all object's properties are arrays of string values
 */

module.exports = function (value) {
  if (!_.isPlainObject(value)) {
    return false
  }

  return Object.keys(value).every(key => {
    if (!_.isArray(value[key])) {
      return false
    }

    // Make sure the array items are strings
    return value[key].every(item => _.isString(item))
  })
}
