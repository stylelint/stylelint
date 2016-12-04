/* @flow */
"use strict"

/**
 * Compares a string to a second value that, if it fits a certain convention,
 * is converted to a regular expression before the comparison.
 * If it doesn't fit the convention, then two strings are compared.
 *
 * Any strings starting and ending with `/` are interpreted
 * as regular expressions.
 */
module.exports = function matchesStringOrRegExp(
  input/*: string | Array<string>*/,
  comparison/*: string | Array<string>*/
)/*: false | { match: string, pattern: string}*/ {
  if (!Array.isArray(input)) {
    return testAgainstStringOrArray(input, comparison)
  }

  for (const inputItem of input) {
    const testResult = testAgainstStringOrArray(inputItem, comparison)
    if (testResult) {
      return testResult
    }
  }

  return false
}

function testAgainstStringOrArray(value, comparison) {
  if (!Array.isArray(comparison)) {
    return testAgainstString(value, comparison)
  }

  for (const comparisonItem of comparison) {
    const testResult = testAgainstString(value, comparisonItem)
    if (testResult) {
      return testResult
    }
  }
  return false
}

function testAgainstString(value, comparison) {
  const comparisonIsRegex = comparison[0] === "/" && comparison[comparison.length - 1] === "/"

  if (comparisonIsRegex) {
    const valueMatches = new RegExp(comparison.slice(1, -1)).test(value)
    return valueMatches ? { match: value, pattern: comparison } : false
  }

  return value === comparison ? { match: value, pattern: comparison } : false
}
