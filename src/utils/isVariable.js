/**
 * Check whether a word is a variable i.e var(--custom-property).
 *
 * @param {string} word
 * @return {boolean} If `true`, the word is a variable
 */
export default function (word) {
  return (word.toLowerCase().slice(0, 4) === "var(")
}
