/**
 * Report a violation.
 *
 * This function accounts for `disabledRanges` attached to the result.
 * That is, if the reported violation is within a disabledRange,
 * it is ignored. Otherwise, it is attached to the result as a
 * postcss warning.
 *
 * You *must* pass *either* a node or a line number.
 *
 * @param {object} violation - Violation details object
 * @param {string} violation.ruleName - The name of the rule
 * @param {Result} violation.result - postcss Result object
 * @param {string} violation.message - Message to inform user of the violation
 * @param {Node} [violation.node] - postcss Node object
 * @param {Node} [violation.index] - Index that should be passed to result.warn()
 * @param {Node} [violation.word] - Word that should be passed to result.warn()
 * @param {number} [violation.line] - Line number of the violation
 */
export default function ({ ruleName, result, message, line, node, index, word }) {
  result.stylelint = result.stylelint || {}

  if (result.stylelint.quiet && result.stylelint.ruleSeverities[ruleName] !== 2) {
    return
  }

  const startLine = (line)
    ? line
    : node.source && node.source.start.line

  if (result.stylelint.disabledRanges) {
    for (let range of result.stylelint.disabledRanges) {
      if (
        // If the violation is within a disabledRange,
        // and that disabledRange's rules include this one,
        // do not register a warning
        range.start <= startLine && (range.end >= startLine || range.end === undefined)
        && (!range.rules || range.rules.indexOf(ruleName) !== -1)
      ) { return }
    }
  }

  const severity = (result.stylelint.ruleSeverities) ? result.stylelint.ruleSeverities[ruleName] : 0
  if (!result.stylelint.stylelintError && severity === 2) {
    result.stylelint.stylelintError = true
  }

  const warningProperties = {
    severity,
    rule: ruleName,
  }
  if (node) { warningProperties.node = node }
  if (index) { warningProperties.index = index }
  if (word) { warningProperties.word = word }

  result.warn(message, warningProperties)
}
