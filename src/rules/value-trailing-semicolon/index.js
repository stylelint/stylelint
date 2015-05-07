export default function valueTrailingSemicolon() {
  return (css, result) => {
    css.eachRule(rule => {
      if (rule.semicolon) {
        return
      }

      result.warn(
        "Expected a trailing semicolon (value-trailing-semicolon)",
        {node: rule}
      )
    })
  }
}
