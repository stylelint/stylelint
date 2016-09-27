/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has postcss-simple-vars interpolation
 */
export default function (string) {
  if (/\$\(.+?\)/.test(string)) { return true }

  return false
}
