/**
 * Check if an object's key contains a word.
 *
 * It will look for a `key` property whose value should
 * be an array of words.
 *
 * @param {object} options
 * @param {string} exceptionName
 * @return {boolean}
 */
export default function (options, key, word) {
  return (
    options
    && options[key]
    && options[key].indexOf(word) !== -1
  )
}
