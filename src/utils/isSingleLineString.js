/**
 * Check if a string is a single line (i.e. does not contain
 * any newline characters)
 *
 * @param {string} str - A block rendered as a string
 * @return {boolean}
 */
export default function (str) {
  return !/[\n\r]/.test(str)
}
