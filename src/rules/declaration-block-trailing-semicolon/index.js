const ruleName = "declaration-block-trailing-semicolon"

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
        `Expected a trailing semicolon (${ruleName})`,
        { node: rule }
      )
    }

    function rejectSemicolon(rule) {
      if (!rule.semicolon) {
        return
      }

      result.warn(
        `Expected no trailing semicolon (${ruleName})`,
        { node: rule }
      )
    }
  }
}
