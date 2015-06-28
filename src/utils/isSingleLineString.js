/**
 * Check if a *trimmed* string is a single line (i.e. does not contain
 * any newline characters).
 *
 * The fact that it's trimmed means that newline characters at the
 * beginning or end will be ignored.
 *
 * @param {string} input
 * @return {boolean}
 */
export default function (input) {
  return !/[\n\r]/.test(input.trim())
}
