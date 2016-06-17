/**
 * Checks if a string contains a value. The comparison value can be a string or
 * an array of strings.
 *
 * Any strings starting and ending with `/` are ignored. Use the
 * matchesStringOrRegExp() util to match regexes.
 *
 * @param {string} input
 * @param {string|array} comparison
 * @return {boolean|object} `false` if no match is found.
 *   If a match is found, returns an object with these properties:
 *   - `match`: the `input` value that had a match
 *   - `pattern`: the `comparison` pattern that had a match
 */
export default function containsString(input, comparison) {
  if (!Array.isArray(comparison)) {
    return testAgainstString(input, comparison)
  }

  for (const comparisonItem of comparison) {
    const testResult = testAgainstString(input, comparisonItem)
    if (testResult) {
      return testResult
    }
  }
  return false
}

function testAgainstString(value, comparison) {
  if (!comparison) return false
  if (comparison[0] === "/" && comparison[comparison.length - 1] === "/") {
    return false
  }

  if (value.indexOf(comparison) >= 0) {
    return { match: value, pattern: comparison }
  }

  return false
}
