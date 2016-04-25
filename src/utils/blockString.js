import rawNodeString from "./rawNodeString"
import hasBlock from "./hasBlock"
import beforeBlockString from "./beforeBlockString"

/**
 * Return a CSS statement's block -- the string that starts and `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
export default function (statement) {
  if (!hasBlock(statement)) { return }
  return rawNodeString(statement).slice(beforeBlockString(statement).length)
}
