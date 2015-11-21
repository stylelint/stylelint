/**
 * Validate if a property is a valid CSS one.
 *
 * @param {string} prop
 * @return {boolean} Whether or not the property is valid (true = valid)
 */

const RE_VALID_CSS_PROPERTY = /^[a-z-]+$/

export default function (prop) {
  return RE_VALID_CSS_PROPERTY.test(prop)
}
