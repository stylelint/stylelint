"use strict"

/**
 * Find the at-rule in which a rule is nested.
 *
 * Returns `null` if the rule is not nested within an at-rule.
 *
 * @param {Rule} rule
 * @return {AtRule|null}
 */
module.exports = function findAtRuleContext(rule) {
  const parent = rule.parent

  if (parent.type === "root") {
    return null
  }
  if (parent.type === "atrule") {
    return parent
  }
  return findAtRuleContext(parent)
}
