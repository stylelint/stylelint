/**
 * Check whether a value is standard
 *
 * @param {string} value
 * @return {boolean} If `true`, the value is a variable
 */
export default function (value) {

  // SCSS variable
  if (value[0] === "$") { return false }

  // Less variable
  if (value[0] === "@") { return false }

  // SCSS or Less interpolation
  if (/#{.+?}|@{.+?}|\$\(.+?\)/.test(value)) { return false }

  return true
}
