export const ruleName = "rule-trailing-semicolon"

export const messages = {
  expected: `Expected a trailing semicolon (${ruleName})`,
  rejected: `Unexpected trailing semicolon (${ruleName})`,
}

/**
 * @param {"always"|"never"} options
 */
export default function declarationBlockTrailingSemicolon(options) {
  return (css, result) => {
    let checkRule
    if (options === "always") {
      checkRule = expectSemicolon
    } else if (options === "never") {
      checkRule = rejectSemicolon
    } else {
      return
    }

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
