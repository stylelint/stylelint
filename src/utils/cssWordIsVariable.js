/**
 * Check whether a word is a variable: $sass, @less, --custom-property, or var(--custom-property).
 *
 * @param {string} word
 * @return {boolean} If `true`, the word is a variable
 */
export default function (word) {
  if (word[0] === "$") return true
  if (word[0] === "@") return true
  if (word.slice(0, 2) === "--") return true
  if (word.slice(0, 4) === "var(") return true
  return false
}
