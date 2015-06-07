/**
 * Report a violation.
 *
 * @param {object} v - Violation details object
 * @param {string} v.ruleName - The name of the rule
 * @param {Result} v.result - PostCSS Result object
 * @param {string} v.message - Message to inform user of the violation
 * @param {Node} v.node - PostCSS Node object
 */
export default function (v) {

  const startLine = v.node.source && v.node.source.start.line

  for (let range of v.result.disabledRanges) {
    if (
      // If the violation is within a disabledRange ...
      range.start <= startLine
      && (range.end === undefined || range.end >= startLine)
      // And that disabledRange's rules include this one ...
      && (!range.rules || range.rules.indexOf(v.ruleName) !== -1)
      // Do not register a warning
    ) { return }
  }

  v.result.warn(v.message, { node: v.node })
}
