/**
 * Check whether a word is standard
 *
 * @param {string} word
 * @return {boolean} If `true`, the word is a variable
 */
export default function (word) {

  // SCSS variable
  if (word[0] === "$") { return false }

  // Less variable
  if (word[0] === "@") { return false }

  return true
}
