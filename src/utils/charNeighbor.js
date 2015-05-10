/**
 * Find the character before or after a given character or index
 * in a string -- one of its neighbors.
 *
 * @param {string} str
 * @param {string|number} char - Character of index to look before
 * @param {number} [offset=-1] - Where to look in relation to `char`
 * @return {string} - Character that is `offset` characters from `char`
 */
export default function (str, char, offset=-1) {
  if (typeof char === "number") {
    return str[str[char] + offset]
  }
  return str[str.indexOf(char) + offset]
}
