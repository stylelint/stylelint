/* @flow */
"use strict"

const _ = require("lodash")
const isCustomPropertySet = require("../utils/isCustomPropertySet")

/**
 * Check whether a Node is a standard rule
 */
module.exports = function (rule/*: Object*/)/*: boolean*/ {
  // Get full selector
  const selector = _.get(rule, "raws.selector.raw", rule.selector)

  // Custom property set (e.g. --custom-property-set: {})
  if (isCustomPropertySet(rule)) {
    return false
  }

  // Called Less mixin (e.g. a { .mixin() })
  if (rule.ruleWithoutBody) {
    return false
  }

  // Less detached rulesets
  if (selector.slice(0, 1) === "@" && selector.slice(-1) === ":") {
    return false
  }

  // Ignore mixin or &:extend rule
  // https://github.com/webschik/postcss-less/blob/master/lib/less-parser.js#L52
  if (rule.params && rule.params[0]) {
    return false
  }

  // Non-outputting Less mixin definition (e.g. .mixin() {})
  if (_.endsWith(selector, ")") && !_.includes(selector, ":")) {
    return false
  }

  // Ignore Scss nested properties
  if (selector.slice(-1) === ":") {
    return false
  }

  return true
}
