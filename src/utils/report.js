/**
 * Report a violation.
 *
 * @param {object} violation - Violation details object
 * @param {string} violation.ruleName - The name of the rule
 * @param {Result} violation.result - PostCSS Result object
 * @param {string} violation.message - Message to inform user of the violation
 * @param {Node} violation.node - PostCSS Node object
 */
export default function (violation) {

  const startLine = violation.node.source && violation.node.source.start.line

  if (violation.result.disabledRanges) {
    for (let range of violation.result.disabledRanges) {
      if (
        // If the violation is within a disabledRange ...
        range.start <= startLine
        && (range.end === undefined || range.end >= startLine)
        // And that disabledRange's rules include this one ...
        && (!range.rules || range.rules.indexOf(violation.ruleName) !== -1)
        // Do not register a warning
      ) { return }
    }
  }

  violation.result.warn(violation.message, { node: violation.node })
}
