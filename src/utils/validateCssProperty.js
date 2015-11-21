/**
 * Validate if a property is a valid CSS one.
 *
 * @param {string} prop
 * @return {boolean} Whether or not the property is valid (true = valid)
 */

export default function (prop) {
  // The validation is done by checking if the property
  // is not a SCSS/LESS variable
  return prop[0] !== "$" && prop[0] !== "@"
}
