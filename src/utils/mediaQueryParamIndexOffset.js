/**
 * Get the offset of a media query's params -- i.e. the index
 * at which they start.
 *
 * @param {AtRule} atRule
 * @return {number} The index offset
 */
export default function (atRule) {
  // Initial 1 is for the `@`
  let indexOffset = 1 + atRule.name.length
  if (atRule.raw("afterName")) {
    indexOffset += atRule.raw("afterName").length
  }
  return indexOffset
}
