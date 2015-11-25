/**
 * Check if an options object contains a certain `ignore` keyword.
 * It will look for an `ignore` property whose value should
 * be an array of keywords.
 *
 * @param {object} options
 * @param {string} ignoredName
 * @return {boolean}
 */
export default function (options, ignoredName) {
  return (
    options
    && options.ignore
    && options.ignore.indexOf(ignoredName) !== -1
  )
}
