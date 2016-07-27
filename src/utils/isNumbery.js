/**
 * Check whether it's a number or a number-like string:
 * i.e. when coerced to a number it == itself.
 *
 * @param {string} value
 * @return {boolean} If `true`, value is a number
 */
export default function (value) {
  return (value.trim().length !== 0 && Number(value) == value)
}
