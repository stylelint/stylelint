import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a certain `ignoreProperties` keyword.
 * It will look for an `ignoreProperties` property whose value should
 * be an array of keywords.
 *
 * @param {object} options
 * @param {string} propertyName
 * @return {boolean}
 */
export default function optionsHaveIgnoredProperty(options, propertyName) {
  return !!(
    options &&
    options.ignoreProperties &&
    matchesStringOrRegExp(propertyName, options.ignoreProperties)
  )
}
