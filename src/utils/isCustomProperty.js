/**
 * Check whether a property is a custom one
 *
 * @param {string} property
 * @return {boolean} If `true`, property is a custom one
 */
export default function (property) {
  return (property.slice(0, 2) === "--")
}
