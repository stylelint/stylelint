export const ruleName = "declaration-block-trailing-semicolon"

export const messages = {
  expected: `Expected a trailing semicolon (${ruleName})`,
  rejected: `Expected no trailing semicolon (${ruleName})`,
}

/**
 * @param {boolean} options - If true, expect trailing semicolons;
 *   if false, reject them
 */
export default function declarationBlockTrailingSemicolon(options) {
  return (css, result) => {
    const checkRule = (options) ? expectSemicolon : rejectSemicolon

    css.eachRule(checkRule)

    function expectSemicolon(rule) {
      if (rule.semicolon) {
        return
      }

      result.warn(
        messages.expected,
        { node: rule }
      )
    }

    function rejectSemicolon(rule) {
      if (!rule.semicolon) {
        return
      }

      result.warn(
        messages.rejected,
        { node: rule }
      )
    }
  }
}
