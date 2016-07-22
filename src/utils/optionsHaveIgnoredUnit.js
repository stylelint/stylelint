import matchesStringOrRegExp from "./matchesStringOrRegExp"

/**
 * Check if an options object contains a user-defined string or regex that
 * matches the passed in unit
 *
 * @param {object} options
 * @param {string} unit
 * @return {boolean} If `true`, a match was found
 */
export default function optionsHaveIgnoredProperty(options, unit) {
  return !!(
    options &&
    options.ignoreUnits &&
    matchesStringOrRegExp(unit.toLowerCase(), options.ignoreUnits)
  )
}
