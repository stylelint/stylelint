/* @flow */
import beforeBlockString from "./beforeBlockString"
import hasBlock from "./hasBlock"
import rawNodeString from "./rawNodeString"

/**
 * Return a CSS statement's block -- the string that starts and `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
export default function (
  statement: postcss$rule | postcss$atRule
): string | boolean {
  if (!hasBlock(statement)) { return false }
  return rawNodeString(statement).slice(beforeBlockString(statement).length)
}
