/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has scss interpolation
 */
export default function (string) {
  if (/#{.+?}/.test(string)) { return true }

  return false
}
