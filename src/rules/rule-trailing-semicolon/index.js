export const ruleName = "rule-trailing-semicolon"

export const messages = {
  expected: `Expected a trailing semicolon (${ruleName})`,
  rejected: `Unexpected trailing semicolon (${ruleName})`,
}

/**
 * @param {"always"|"never"} options
 */
export default function ruleTrailingSemicolon(options) {
  return (css, result) => {

    css.eachRule(function (rule) {

      // return early if an empty rule
      if (rule.nodes.length === 0) { return }

      if (options === "always" && !rule.semicolon) {
        result.warn(
          messages.expected,
          { node: rule }
        )
        return
      }

      if (options === "never" && rule.semicolon) {
        result.warn(
          messages.rejected,
          { node: rule }
        )
      }
    })
  }
}
