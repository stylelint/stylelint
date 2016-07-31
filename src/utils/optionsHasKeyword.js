/**
 * Check if an options object's property contains a keyword.
 *
 * It will look for a `property` whose value should
 * be an array of words.
 *
 * @param {object} options
 * @param {string} property
 * @param {string} keyword
 * @return {boolean}
 */
export default function (options, property, keyword) {
  return (
    options
    && options[property]
    && options[property].indexOf(keyword) !== -1
  )
}
