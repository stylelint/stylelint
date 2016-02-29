/**
 * Check whether one specificity measurement is lower than another.
 *
 * Speficity measurements can be in the following formats:
 * - Array of 4 strings or numbers, e.g. [ 0, 1, 0, 2 ]
 * - String with 4 comma-separated values, e.g. "0,1,0,2"
 *
 * @param {specificity} a
 * @param {specificity} b
 * @return {boolean} `true` is `a` is a lower specificity value than `b`
 */
export default function (a, b) {
  const arrayA = (typeof a === "string") ? a.split(",") : a
  const arrayB = (typeof b === "string") ? b.split(",") : b
  for (let i = 0, l = arrayB.length; i < l; i++) {
    if (arrayA[i] > arrayB[i]) {
      return false
    }
    if (arrayB[i] > arrayA[i]) {
      return true
    }
  }
  return false
}
