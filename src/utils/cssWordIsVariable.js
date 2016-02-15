/**
 * Check whether a word is a variable: $sass, @less, or --custom-property.
 *
 * @param {string} word
 * @return {boolean} If `true`, the word is a variable
 */
export default function (word) {
  if (word[0] === "$") return true
  if (word[0] === "@") return true
  if (word.slice(0, 2) === "--") return true
  return false
}
