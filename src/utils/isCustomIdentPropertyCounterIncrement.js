import { isFinite } from "lodash"
/**
 * Check value is a custom ident
 *
 * @param {string} value
 * @return {boolean} If `true`, value is a custom ident
 */

// https://developer.mozilla.org/ru/docs/Web/CSS/counter-increment
const knownValues = new Set([
  "none", "inherit", "initial", "unset",
])

export default function (value) {
  const valueLowerCase = value.toLowerCase()

  if (knownValues.has(valueLowerCase) || isFinite(parseInt(valueLowerCase))) { return false }

  return true
}
