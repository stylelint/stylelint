/**
 * Deprecated
 *
 * Check whether a word is a variable: $sass, @less, --custom-property, or var(--custom-property).
 *
 * @param {string} word
 * @return {boolean} If `true`, the word is a variable
 */
export default function (word) {
  console.log("utils.cssWordIsVariable() has been deprecated and will be removed in 7.0") // eslint-disable-line no-console
  if (word[0] === "$") return true
  if (word[0] === "@") return true
  if (word.slice(0, 2) === "--") return true
  if (word.toLowerCase().slice(0, 4) === "var(") return true
  return false
}
