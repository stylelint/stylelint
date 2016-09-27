/**
 * Check whether a string has less interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has less interpolation
 */
export default function (string) {
  if (/@{.+?}/.test(string)) { return true }

  return false
}
