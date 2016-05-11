/**
 * Check value is a custom ident
 *
 * @param {string} value
 * @return {boolean} If `true`, value is a custom ident
 */

// https://developer.mozilla.org/ru/docs/Web/CSS/animation-name
const knownValues = new Set([
  "none", "inherit", "initial", "unset",
])

export default function (value) {
  return !knownValues.has(value.toLowerCase())
}
