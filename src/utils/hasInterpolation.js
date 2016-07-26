/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, the selector is standard
 */
export default function (string) {

  // SCSS or Less interpolation
  if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(string)) { return true }

  return false
}
