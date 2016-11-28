"use strict"

const _ = require("lodash")
const hasBlock = require("../utils/hasBlock")

/**
 * Check whether a property is a custom properties
 *
 * @param {string} rule
 * @return {boolean} If `true`, property is a custom properties
 */
module.exports = function (rule) {
  const selector = _.get(rule, "raws.selector.raw", rule.selector)

  return rule.type === "rule" && hasBlock(rule) && selector.slice(0, 2) === "--" && selector.slice(-1) === ":"
}
