/**
 * Find the character before a given character or index
 * in a string.
 *
 * @param {string} str
 * @param {string|number} char - Character of index to look before
 * @param {number} [lookback=1] - Number of characters to look back before `char`
 * @return {string} - Character that is `lookback` characters before `char`
 */
export default function (str, char, lookback=1) {
  if (typeof char === "number") {
    return str[str[char] - lookback]
  }
  return str[str.indexOf(char) - lookback]
}
