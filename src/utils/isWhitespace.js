/**
 * Check if a character is whitespace.
 *
 * @param {string} char - A single character
 * @return {boolean}
 */
export default function (char) {
  return [ " ", "\n", "\t", "\r", "\f" ].indexOf(char) !== -1
}
