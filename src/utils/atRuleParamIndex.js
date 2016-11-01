/* @flow */
/**
 * Get the index of a media query's params
 *
 * @param {AtRule} atRule
 * @return {int} The index
 */
export default function (atRule: postcss$atRule) {
  // Initial 1 is for the `@`
  let index = 1 + atRule.name.length
  if (atRule.raws.afterName) {
    index += atRule.raws.afterName.length
  }
  return index
}
