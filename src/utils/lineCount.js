/**
 * Count the lines in a string.
 *
 * @param {string} source
 * @returns {number} Line count
 */
export default function (source) {
  return source.split(/(?:\r\n|\n|\r)/g).length
}
