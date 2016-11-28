"use strict"

const _ = require("lodash")

/**
 * Report a violation.
 *
 * This function accounts for `disabledRanges` attached to the result.
 * That is, if the reported violation is within a disabledRange,
 * it is ignored. Otherwise, it is attached to the result as a
 * postcss warning.
 *
 * It also accounts for the rule's severity.
 *
 * You *must* pass *either* a node or a line number.
 *
 * @param {object} violation - Details about the violation
 * @param {string} violation.ruleName - The name of the rule
 * @param {Result} violation.result - postcss Result object
 * @param {string} violation.message - Message to inform user of the violation
 * @param {Node} [violation.node] - postcss Node object
 * @param {Node} [violation.index] - Index that should be passed to result.warn()
 * @param {Node} [violation.word] - Word that should be passed to result.warn()
 * @param {number} [violation.line] - Line number of the violation
 */
module.exports = function (violation) {
  const ruleName = violation.ruleName
  const result = violation.result
  const message = violation.message
  const line = violation.line
  const node = violation.node
  const index = violation.index
  const word = violation.word

  result.stylelint = result.stylelint || {}

  // In quiet mode, mere warnings are ignored
  if (result.stylelint.quiet && result.stylelint.ruleSeverities[ruleName] !== "error") {
    return
  }

  // If a line is not passed, use the node.positionBy method to get the
  // line number that the complaint pertains to
  const startLine = line || node.positionBy({ index }).line

  if (result.stylelint.disabledRanges && !result.stylelint.ignoreDisables) {
    const ranges = result.stylelint.disabledRanges[ruleName] || result.stylelint.disabledRanges.all
    for (const range of ranges) {
      if (
      // If the violation is within a disabledRange,
      // and that disabledRange's rules include this one,
      // do not register a warning
      range.start <= startLine && (range.end >= startLine || range.end === undefined) && (!range.rules || range.rules.indexOf(ruleName) !== -1)) {
        return
      }
    }
  }

  const severity = _.get(result.stylelint, [ "ruleSeverities", ruleName ], "ignore")

  if (!result.stylelint.stylelintError && severity === "error") {
    result.stylelint.stylelintError = true
  }

  const warningProperties = {
    severity,
    rule: ruleName,
  }
  if (node) {
    warningProperties.node = node
  }
  if (index) {
    warningProperties.index = index
  }
  if (word) {
    warningProperties.word = word
  }

  const warningMessage = _.get(result.stylelint, [ "customMessages", ruleName ], message)
  result.warn(warningMessage, warningProperties)
}
