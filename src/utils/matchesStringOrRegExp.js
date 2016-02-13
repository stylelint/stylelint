/**
 * Compares a string to a second value that, if it fits a certain convention,
 * is converted to a regular expression before the comparison.
 * If it doesn't fit the convention, then two strings are compared.
 *
 * Any strings starting and ending with `/` are interpreted
 * as regular expressions.
 *
 * @param {string|array} input
 * @param {string|regexp|array} comparisonInput
 * @return {boolean}
 */
export default function (input, comparisonInput) {
  if (Array.isArray(input)) {
    return input.some(testAgainstStringOrArray)
  }
  return testAgainstStringOrArray(input)

  function testAgainstStringOrArray(value) {
    if (Array.isArray(comparisonInput)) {
      return comparisonInput.some(comparison => {
        return testAgainstString(value, comparison)
      })
    }
    return testAgainstString(value, comparisonInput)
  }

  function testAgainstString(value, comparison) {
    const comparisonIsRegex = comparison[0] === "/"
      && comparison[comparison.length - 1] === "/"
    if (comparisonIsRegex) {
      return new RegExp(comparison.slice(1, -1)).test(value)
    }
    return value === comparison
  }
}
