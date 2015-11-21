/**
 * Check whether a property is a variable: $sass, @less, or --custom-property.
 *
 * @param {string} prop
 * @return {boolean} If `true`, the prop is a variable
 */
export default function (prop) {
  if (prop[0] === "$") return true
  if (prop[0] === "@") return true
  if (prop.slice(0, 2) === "--") return true
  return false
}
