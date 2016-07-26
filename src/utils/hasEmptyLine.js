/**
 * Check if a string contains at least one empty line
 *
 * @param {string} input
 * @return {boolean}
 */
export default function (string) {
  return string
    && (
      string.indexOf("\n\n") !== -1
      || string.indexOf("\n\r\n") !== -1
    )
}
