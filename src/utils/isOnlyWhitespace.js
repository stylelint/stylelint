import isWhitespace from "./isWhitespace"

/**
 * Returns a Boolean indicating whether the the input string is only whitespace.
 *
 * @param {string} input
 * @return {boolean}
 */
export default function (input) {
  let isOnlyWhitespace = true
  for (let i = 0, l = input.length; i < l; i++) {
    if (!isWhitespace(input[i])) {
      isOnlyWhitespace = false
      break
    }
  }
  return isOnlyWhitespace
}
