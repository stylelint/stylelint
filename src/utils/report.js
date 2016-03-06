import _ from "lodash"

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
 * @param {string} [violation.sourceCode] - The source code of the violation
 * @param {any} [violation.primaryOption] - The rule's primary option
 * @param {object} [violation.secondaryOptions] - The rule's secondary options
 */
export default function (violation) {
  const { result, ruleName } = violation
  result.stylelint = result.stylelint || {}

  // In quiet mode, mere warnings are ignored
  if (result.stylelint.quiet && result.stylelint.ruleSeverities[ruleName] !== "error") {
    return
  }

  // If a line is not passed, use the node.positionBy method to get the
  // line number that the complaint pertains to
  const startLine = violation.line
    || violation.node.positionBy({ index: violation.index }).line

  if (result.stylelint.disabledRanges) {
    for (const range of result.stylelint.disabledRanges) {
      if (
        // If the violation is within a disabledRange,
        // and that disabledRange's rules include this one,
        // do not register a warning
        range.start <= startLine
        && (range.end >= startLine || range.end === undefined)
        && (!range.rules || range.rules.indexOf(ruleName) !== -1)
      ) { return }
    }
  }

  const severity = _.get(result.stylelint, [ "ruleSeverities", ruleName ], "ignore")

  if (typeof severity === "undefined") {
    throw new Error(
      `The rule name "${ruleName}" has no corresponding registered severity.\n\n` +
      "This is most likely a bug in stylelint: please file an issue with this stack trace " +
      `at\nhttps://github.com/stylelint/stylelint/issues`
    )
  }

  if (!result.stylelint.stylelintError && severity === "error") {
    result.stylelint.stylelintError = true
  }

  const warningProperties = _.assign({ severity, rule: ruleName }, _.pick(violation, [
    "node",
    "index",
    "word",
    "sourceCode",
    "primaryOptions",
    "secondaryOptions",
  ]))

  let warningMessage = violation.message
  const customMessage = _.get(result.stylelint, [ "customMessages", ruleName ])
  if (customMessage) {
    warningMessage = _.template(customMessage)(warningProperties)
  }
  result.warn(warningMessage, warningProperties)
}
