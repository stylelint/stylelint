import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a user-defined string or regex that
 * matches the passed in property name.
 *
 * @param {object} options
 * @param {string} property name
 * @return {boolean} If `true`, a match was found
 */
export default function optionsHaveIgnoredProperty(options, propertyName) {
  return !!(
    options &&
    options.ignoreProperties &&
    matchesStringOrRegExp(propertyName.toLowerCase(), options.ignoreProperties)
  )
}
